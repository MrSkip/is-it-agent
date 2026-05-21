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
  guidance: Guidance[];
};

export function recommend(answers: Answers): Recommendation {
  const shape = problemShape(answers);
  return { ...shape, guidance: buildGuidance(answers, shape.verdict) };
}

type Shape = {
  verdict: Verdict;
  title: string;
  trace: string;
  rationale: string;
};

function problemShape(answers: Answers): Shape {
  if (answers[3] === "yes") {
    return {
      verdict: "single-call",
      title: "Single LLM call",
      trace: "You said yes to Q3 — input goes in, output comes out, done.",
      rationale:
        "Don't reach for a framework. One prompt, one call, one response. Add structured output if you need a stable shape. You can always escalate later if real usage reveals you need more.",
    };
  }

  const part1Yes = [1, 2, 4].filter((id) => answers[id] === "yes");
  const part1No = [1, 2, 4].filter((id) => answers[id] === "no");
  const part2Yes = [5, 6, 7].filter((id) => answers[id] === "yes");
  const part2No = [5, 6, 7].filter((id) => answers[id] === "no");

  if (part2Yes.length >= 2 && part1Yes.length <= 1) {
    const parts: string[] = [];
    if (part1No.length)
      parts.push(`no to ${part1No.map((id) => `Q${id}`).join(", ")}`);
    if (part2Yes.length)
      parts.push(`yes to ${part2Yes.map((id) => `Q${id}`).join(", ")}`);
    return {
      verdict: "agent",
      title: "Agent",
      trace: `You said ${parts.join(" and ")} — that's an agent shape.`,
      rationale:
        `An agent runs a loop: act → observe → decide → repeat until done. It's worth the cost when the path branches based on intermediate results, the tool order isn't predictable in advance, and stopping is itself a decision the system has to make. One thing to double-check: if your "dynamic" behavior is really a top-level classifier routing to fixed prompt chains, that's a routing workflow — not an agent. Budget upfront for evals and observability; they're not optional here.`,
    };
  }

  const parts: string[] = [];
  if (part1Yes.length)
    parts.push(`yes to ${part1Yes.map((id) => `Q${id}`).join(", ")}`);
  if (part2No.length)
    parts.push(`no to ${part2No.map((id) => `Q${id}`).join(", ")}`);
  return {
    verdict: "workflow",
    title: "Workflow",
    trace: parts.length
      ? `You said ${parts.join(" and ")} — that's a workflow, not an agent.`
      : "Mixed signals, but no strong agent case — start with a workflow.",
    rationale:
      "Chain LLM calls in a fixed order. Each step has a known input and a known output. You get most of the leverage of LLMs with very little of the cost or instability of an agent. Escalate to an agent only when you can point at a specific thing the workflow can't do.",
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
