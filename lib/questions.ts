export type Part = 1 | 2;

export type Question = {
  id: number;
  part: Part;
  text: string;
  example: string;
};

export const questions: Question[] = [
  {
    id: 1,
    part: 1,
    text: "Can you write down, in advance, every step the system needs to take?",
    example:
      `An invoice processor: receive PDF → extract fields → validate against the DB → store → email confirmation. You can sketch the whole pipeline before writing a line of code.`,
  },
  {
    id: 2,
    part: 1,
    text: "Do users mostly want one of a small number of known outcomes, each with a known happy path?",
    example:
      `A support bot where the realistic outcomes are "tell me where my order is," "process a return," and "update my address." Each has a known happy path. Not: "plan my European vacation," where the outcome space is wide-open.`,
  },
  {
    id: 3,
    part: 1,
    text: "Does the task complete in one shot — input goes in, output comes out, done?",
    example:
      `Summarize this article. Translate this paragraph. Classify this email as spam or not. One model call, one answer, done.`,
  },
  {
    id: 4,
    part: 1,
    text: "At each step, can you specify the output schema in advance — fixed fields, fixed format?",
    example:
      `An invoice extractor always returns {vendor, amount, due_date, line_items[]}. A two-step pipeline where both steps produce JSON with known fields. Not: "sometimes a paragraph, sometimes a table, depending on what the LLM decides."`,
  },
  {
    id: 5,
    part: 2,
    text: "Does the system need to decide, based on intermediate results, what to do next?",
    example:
      `A Deep Research agent reads a source, decides whether to search for more, decides when it has enough to write up — the path branches with every finding. (Perplexity Deep Research, OpenAI's o3 research mode, and similar systems all use this pattern.)`,
  },
  {
    id: 6,
    part: 2,
    text: "Does the task require calling tools in an order you can't predict in advance?",
    example:
      `A coding assistant might read a file, run tests, edit code, read another file, run tests again — or might do that in reverse. You can't write the sequence down ahead of time.`,
  },
  {
    id: 7,
    part: 2,
    text: "Does the system need to recognize on its own when the task is finished?",
    example:
      `"Fix this bug" — the system has to decide when the fix is good enough to stop. There's no fixed step count, and "done" is itself a judgment call.`,
  },
  {
    id: 8,
    part: 2,
    text: "Have you already built and shipped the simplest non-agent version and found it insufficient?",
    example:
      `You shipped a single-prompt version, watched real users use it, and identified specific failure modes a workflow couldn't fix. Not "I have a hunch we'll need an agent."`,
  },
  {
    id: 9,
    part: 2,
    text: "If the system takes a wrong action, is it reversible without human cleanup?",
    example:
      `Reversible: a research agent generates a summary — if it's wrong, you re-read the source and nothing else happened. Not reversible: a trading bot submits an order, a customer-service agent sends an email, a coding agent pushes to production. Once the action happens, undoing it costs time, money, or trust.`,
  },
];
