export type Category = "architectures" | "patterns" | "practice" | "examples";

export type Term = {
  slug: string;
  name: string;
  category: Category;
  short: string;
  detail: string;
};

export const categories: {
  id: Category;
  label: string;
  description: string;
}[] = [
  {
    id: "architectures",
    label: "Architectures",
    description: "The four shapes a system can take.",
  },
  {
    id: "patterns",
    label: "Patterns",
    description: "Building blocks and workflow sub-types.",
  },
  {
    id: "practice",
    label: "Practice",
    description: "Operating these systems in production.",
  },
  {
    id: "examples",
    label: "Modern examples",
    description: "Canonical 2025–2026 systems to compare against.",
  },
];

export const terms: Term[] = [
  {
    slug: "automation",
    name: "Automation",
    category: "architectures",
    short: "A deterministic script. Same input → same output, every time. No LLM.",
    detail: `Example: a cron job that compresses log files older than 30 days, or a script that copies new rows from one database to another. Use when the steps are knowable, no judgment is required, and you want zero variance. Most "I need an AI for this" requests can be served by plain automation.`,
  },
  {
    slug: "single-llm-call",
    name: "Single LLM call",
    category: "architectures",
    short: "One prompt, one response. The simplest LLM-powered solution.",
    detail: `Example: classifying a piece of text as spam, summarizing an article, translating a paragraph. The whole task is "input goes in, output comes out, done." Practitioners systematically under-use this; it solves more problems than the discourse suggests.`,
  },
  {
    slug: "workflow",
    name: "Workflow",
    category: "architectures",
    short: "Multiple LLM calls chained together in a fixed, predefined order.",
    detail: `Each step has a known input and a known output shape. Example: extract structured data from an invoice → validate against business rules → format as JSON for the downstream system. You — the engineer — control the path. The LLM only decides the contents of each step's output, not the order of steps.`,
  },
  {
    slug: "agent",
    name: "Agent",
    category: "architectures",
    short:
      "An LLM running in a loop: act → observe → decide → repeat until done.",
    detail: `The LLM controls the path, not just the contents. Example: a coding assistant that reads a file, edits code, runs tests, reads the test output, and decides whether to keep going or stop. Anthropic's working definition: a system that "dynamically directs its own processes and tool usage." Simon Willison's tighter version: "tools in a loop."`,
  },
  {
    slug: "tool-use",
    name: "Tool use",
    category: "patterns",
    short:
      "When an LLM invokes external functions — search, code execution, database queries, APIs.",
    detail: `Modern LLMs can request a tool call as part of their output. Your system executes the tool and feeds the result back into the next LLM call. Tool use is what turns an LLM from a text generator into a workflow or agent — without tools, there's nothing for the LLM to chain or loop over.`,
  },
  {
    slug: "routing",
    name: "Routing",
    category: "patterns",
    short:
      "A workflow pattern: classify the input, then run a different fixed chain for each category.",
    detail: `Example: a support bot that classifies an incoming message as "refund," "shipping," or "account," then routes to three different prompt chains. Often mistaken for an agent — but the dynamic step (the classification) happens once at the top, then everything else is fixed. The LLM doesn't loop.`,
  },
  {
    slug: "prompt-chaining",
    name: "Prompt chaining",
    category: "patterns",
    short:
      "A workflow pattern: the output of one LLM call becomes the input to the next.",
    detail: `Useful when each step has a clear, narrower job than asking everything at once. Example: "outline the article → write each section → polish the whole thing" is three prompts in a chain, not one big "write me an article" prompt. Easier to debug, evaluate, and improve.`,
  },
  {
    slug: "hitl",
    name: "Human-in-the-loop (HITL)",
    category: "practice",
    short:
      "Inserting a human approval step before an irreversible action.",
    detail: `Standard practice for agents (and many workflows) that send emails, make purchases, modify production systems, or take any action that needs cleanup if wrong. The right granularity is per-action, not per-task: approve the email send, not the entire customer-support session. Don't gate on the LLM's confidence — gate on the action's reversibility.`,
  },
  {
    slug: "blast-radius",
    name: "Blast radius",
    category: "practice",
    short:
      "How much damage a wrong action can do before someone notices.",
    detail: `A research agent generating a wrong summary has small blast radius — you re-read the source, nothing else happened. A trading bot submitting wrong orders has huge blast radius — real money is gone. The strongest predictor of whether you need HITL, regardless of how agent-shaped the problem looks. (OWASP's 2026 Top 10 for Agentic Applications treats this as the central operational risk.)`,
  },
  {
    slug: "eval",
    name: "Eval",
    category: "practice",
    short:
      "A way to measure whether the system's output is good.",
    detail: `For a single LLM call, often a benchmark dataset with known correct answers. For an agent, harder — what does "good" mean across a multi-step trajectory with branches? If you can't define and automate this, you can't safely run an agent in production. The most common reason agent projects stall is that nobody figured out what to measure.`,
  },
  {
    slug: "structured-output",
    name: "Structured output",
    category: "practice",
    short:
      "Constraining the LLM to produce JSON that matches a schema you define.",
    detail: `Eliminates an entire class of parsing bugs and is the right default for most production single-call use cases. Anthropic and OpenAI both have native support — no need for regex parsing or "please respond in JSON" prompt tricks. If you find yourself wanting a workflow because the output is unpredictable, try structured output on a single call first.`,
  },
  {
    slug: "stopping-condition",
    name: "Stopping condition",
    category: "practice",
    short: "How an agent decides it's done.",
    detail: `An agent isn't an infinite loop; it has a termination criterion: the task is complete, a max-iterations cap is hit, or a confidence threshold is reached. Designing a clear stopping condition is one of the hardest parts of building a reliable agent. Vague conditions ("when the task is done") lead to runaway loops or premature stops.`,
  },
  {
    slug: "deep-research",
    name: "Deep Research agent",
    category: "examples",
    short: "The canonical 2025–2026 example of an agent in production.",
    detail: `Perplexity Deep Research, OpenAI deep research, Anthropic's research agents. Reads sources, decides what to search for next, decides when it has enough material, writes up the answer. The path branches with every finding — you can't write the search order down ahead of time, which is the defining property of an agent.`,
  },
];
