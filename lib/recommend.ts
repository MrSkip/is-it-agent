export type Verdict = "simple-first" | "single-call" | "workflow" | "agent";

export type Answer = "yes" | "no";

export type Answers = Record<number, Answer>;

export type Recommendation = {
  verdict: Verdict;
  title: string;
  trace: string;
  rationale: string;
};

export function recommend(answers: Answers): Recommendation {
  if (answers[8] === "no") {
    return {
      verdict: "simple-first",
      title: "Build the simple version first",
      trace: "You said no to Q8 — you haven't shipped the simple version yet.",
      rationale:
        "Q8 is the load-bearing question. Every other question is a prediction about your problem; Q8 is evidence. Ship the single-call or workflow version, watch what breaks in real usage, then come back to the rest of the questions. Predictions are wrong all the time; shipped code isn't.",
    };
  }

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
        "An agent is worth the cost when the path branches based on intermediate results, the tool order isn't predictable in advance, and stopping is itself a decision the system has to make. Use an established loop (act → observe → decide), and budget upfront for evals and observability — they're not optional for agents.",
    };
  }

  const parts: string[] = [];
  if (part1Yes.length)
    parts.push(`yes to ${part1Yes.map((id) => `Q${id}`).join(", ")}`);
  if (part2No.length)
    parts.push(`no to ${part2No.map((id) => `Q${id}`).join(", ")}`);
  return {
    verdict: "workflow",
    title: "Workflow with LLM calls",
    trace: parts.length
      ? `You said ${parts.join(" and ")} — that's a workflow, not an agent.`
      : "Mixed signals, but no strong agent case — start with a workflow.",
    rationale:
      "Chain LLM calls in a fixed order. Each step has a known input and a known output. You get most of the leverage of LLMs with very little of the cost or instability of an agent. Escalate to an agent only when you can point at a specific thing the workflow can't do.",
  };
}
