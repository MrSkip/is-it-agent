export type Verdict = "single-call" | "workflow" | "agent";

export type Answer = "yes" | "no";

export type Answers = Partial<Record<number, Answer>>;

export type Guidance = {
  title: string;
  body: string;
  trace: string;
};

export type Recommendation = {
  verdict: Verdict;
  title: string;
  trace: string;
  rationale: string;
  effort: string;
  notThis: string;
  commonMisread: string;
  nextSteps: string[];
  guidance: Guidance[];
};

export function recommend(answers: Answers): Recommendation {
  const shape = problemShape(answers);
  return { ...shape, guidance: buildGuidance(answers, shape.verdict) };
}

type Shape = Omit<Recommendation, "guidance">;

function problemShape(answers: Answers): Shape {
  if (answers[3] === "yes") {
    return {
      verdict: "single-call",
      title: "Single LLM call",
      trace: "You said yes to Q3 — input goes in, output comes out, done.",
      rationale:
        "Don't reach for a framework. One prompt, one call, one response. Add structured output if you need a stable shape. You can always escalate later if real usage reveals you need more.",
      effort:
        "Days to a couple weeks of build. Light eval (a rubric and 20–50 examples is usually enough).",
      notThis:
        "Not a workflow. Adding a second prompt step doesn't make it one — it makes it a slower, more fragile single-call. If you genuinely need multiple steps with their own schemas, retake the quiz with the more honest answers.",
      commonMisread:
        "Teams that land here often add unnecessary glue: a three-prompt \"chain\" that's really one prompt, or a \"mini-agent\" wrapper around a task the base model already handles alone. Resist — the win at this verdict is from doing less, not more.",
      nextSteps: [
        "Write the prompt in plain language, with one or two example inputs and the outputs you'd want for them.",
        "Define the output schema (Anthropic's structured outputs, OpenAI JSON schema, or a TypeScript type you parse against). Don't ask the model to \"please respond in JSON.\"",
        "Pick 10–20 realistic inputs and run them through. Eyeball the outputs honestly — note anything wrong, weird, or close-but-not-quite.",
        `Write down what "correct" looks like before tuning. A one-paragraph rubric beats a vibe check.`,
        "Add one retry that feeds back the schema-validation error if the first call doesn't match. Then stop adding complexity.",
      ],
    };
  }

  const part1Yes = [1, 2, 4].filter((id) => answers[id] === "yes");
  const part1No = [1, 2, 4].filter((id) => answers[id] === "no");
  const part2Yes = [5, 6, 7].filter((id) => answers[id] === "yes");
  const part2No = [5, 6, 7].filter((id) => answers[id] === "no");

  if (part2Yes.length >= 2 && part1Yes.length <= 1) {
    const p2YesList = part2Yes.map((id) => `Q${id}`).join(", ");
    const trace =
      part1Yes.length > 0
        ? `You said yes to ${part1Yes
            .map((id) => `Q${id}`)
            .join(
              ", ",
            )} (workflow signal) AND yes to ${p2YesList} (agent signals) — that's an agent shape.`
        : `You said no to ${part1No
            .map((id) => `Q${id}`)
            .join(", ")} and yes to ${p2YesList} — that's an agent shape.`;
    return {
      verdict: "agent",
      title: "Agent",
      trace,
      rationale: `An agent runs a loop: act → observe → decide → repeat until done. It's worth the cost when the path branches based on intermediate results, the tool order isn't predictable in advance, and stopping is itself a decision the system has to make. One thing to double-check: if your "dynamic" behavior is really a top-level classifier routing to fixed prompt chains, that's a routing workflow — not an agent. Budget upfront for evals and observability; they're not optional here.`,
      effort:
        "Months to ship a first version, plus ongoing eval and observability ops you can't skip. Plan for a dedicated owner.",
      notThis:
        "Not a chatbot, not a workflow with smarter prompts. An agent runs a real loop — act, observe, decide, repeat — and decides for itself when to stop. If yours doesn't, it's something else; build that something else first.",
      commonMisread:
        "Most projects that land here actually need a routing workflow: a classifier picks one of N fixed prompt chains. That's not an agent — and it's an order of magnitude less work. Re-check Q5 and Q6 against the negation in each question before committing.",
      nextSteps: [
        "Enumerate every tool the agent can call. For each one, mark whether it's reversible without human cleanup.",
        `Write the stopping condition explicitly: when has the agent done enough? "When the task is done" is not a stopping condition.`,
        `Build the eval before shipping: define what "good" means across a complete multi-step trajectory, and automate the grading.`,
        "Cap max iterations (start with 5–10). Log every step's input, output, and chosen action — you'll need this when behavior surprises you.",
        "Put a human-in-the-loop approval in front of every irreversible tool call. Don't gate on the model's confidence; gate on the action's blast radius.",
      ],
    };
  }

  const conflict = part1Yes.length >= 2 && part2Yes.length >= 2;

  const parts: string[] = [];
  if (part1Yes.length)
    parts.push(`yes to ${part1Yes.map((id) => `Q${id}`).join(", ")}`);
  if (part2No.length)
    parts.push(`no to ${part2No.map((id) => `Q${id}`).join(", ")}`);

  const trace = conflict
    ? `You said yes to ${part1Yes
        .map((id) => `Q${id}`)
        .join(", ")} (workflow signals) AND yes to ${part2Yes
        .map((id) => `Q${id}`)
        .join(", ")} (agent signals) — your answers conflict.`
    : parts.length
      ? `You said ${parts.join(" and ")} — that's a workflow, not an agent.`
      : "Mixed signals, but no strong agent case — start with a workflow.";

  const rationale = conflict
    ? "Your answers signal both shapes, which usually means one isn't quite right — a system can't simultaneously have fully predetermined steps and need dynamic mid-task decisions. The Part 1 yeses win the verdict: if you really can write down every step in advance, you don't need the agent loop. Re-read whichever answer felt least solid — the Part 2 yeses may be aspirational, or a Part 1 yes may be glossing over real branching. Workflow is the safer starting shape regardless; escalate later if real usage exposes a specific gap."
    : "Chain LLM calls in a fixed order. Each step has a known input and a known output. You get most of the leverage of LLMs with very little of the cost or instability of an agent. Escalate to an agent only when you can point at a specific thing the workflow can't do.";

  return {
    verdict: "workflow",
    title: "Workflow",
    trace,
    rationale,
    effort:
      "Weeks to a couple months, plus eval setup for each step (the per-step schemas give you cheap, targeted evals).",
    notThis:
      "Not an agent. No LLM call decides which step runs next — that's the line. If you find yourself adding \"and then the model decides…\", you've crossed into agent territory and the cost profile changes.",
    commonMisread:
      "Teams that land here often build it as an agent anyway because it sounds smarter, then spend months debugging non-determinism they didn't need. The fixed sequence is the point — it's what makes the system testable, cheap, and predictable.",
    nextSteps: [
      "Sketch the steps on paper before writing code. Name each step, its input, and its output. If you can't, you don't have a workflow — you have an agent in disguise.",
      "Define an explicit schema for each intermediate step. The output of step N is the input of step N+1.",
      "Implement each step as a separate function with its own test inputs. You should be able to test step 3 without running steps 1 and 2.",
      "Wire the steps in a fixed sequence. No LLM call decides which step runs next — that's what makes it a workflow.",
      "Decide per-step failure handling before you ship: retry, skip with a default, or fail loud? Don't punt this to the user.",
    ],
  };
}

function buildGuidance(answers: Answers, verdict: Verdict): Guidance[] {
  const items: Guidance[] = [];

  if (answers[8] === "no" && verdict !== "single-call") {
    items.push({
      title: "Start with the simple version first",
      body: `Whatever the shape of your problem turns out to be, ship the smallest viable version — a single prompt or a short chain — and watch what real usage breaks. "Find the simplest solution possible, and only increase complexity when needed" is the most-cited principle in the agent literature. Predictions about the problem are wrong all the time; shipped code isn't.`,
      trace: "You said no to Q8 — the simpler version hasn't been ruled out yet.",
    });
  }

  if (answers[9] === "no") {
    items.push({
      title: "Add human-in-the-loop for irreversible actions",
      body: `If a wrong action needs human cleanup, put an approval step in front of every such action — regardless of whether you build a workflow or an agent. OWASP's 2026 Top 10 for Agentic Applications and most public 2025–2026 production post-mortems trace back to this gap. Bound autonomy explicitly: list the irreversible actions, and require a human (or a separate verifier) to confirm each one.`,
      trace: "You said no to Q9 — wrong actions aren't reversible without cleanup.",
    });
  }

  return items;
}
