export type Part = 1 | 2;

export type Question = {
  id: number;
  part: Part;
  text: string;
  examples: string[];
  noHint?: string;
};

export const questions: Question[] = [
  {
    id: 1,
    part: 1,
    text: "Can you write down, in advance, every step the system needs to take?",
    examples: [
      `An invoice processor: receive PDF → extract fields → validate against the DB → store → email confirmation. You can sketch the whole pipeline before writing a line of code.`,
      `Employee onboarding: collect new-hire info → provision accounts → assign a laptop → schedule day-1 meetings. Same five steps every time, only the names change.`,
      `Order fulfillment: payment received → inventory reserved → label printed → handed to carrier → tracking emailed. The path is fixed; only the order contents vary.`,
    ],
  },
  {
    id: 2,
    part: 1,
    text: "Do users mostly want one of a small number of known outcomes, each with a known happy path?",
    examples: [
      `A support bot where the realistic outcomes are "tell me where my order is," "process a return," and "update my address." Each has a clear way to handle it. Not: "plan my European vacation," where the outcome space is wide-open.`,
      `A repo assistant where users want "find this function," "explain this file," or "who owns this code." Three known outcomes, each with a clear answer pattern.`,
      `A meeting-notes tool where users want a summary, action items, or a follow-up email draft. Bounded set; each outcome has a well-defined shape.`,
    ],
  },
  {
    id: 3,
    part: 1,
    text: "Does the task complete in one shot — input goes in, output comes out, done?",
    examples: [
      `Summarize this article. Translate this paragraph. Classify this email as spam or not. One model call, one answer, done.`,
      `Suggest a commit message from a diff. Generate a docstring for this function. Convert this SQL query to PostgreSQL syntax. Each is a single round-trip.`,
      `Generate a meta description for a blog post. Extract keywords from a press release. Write alt text for an image. No follow-up needed.`,
    ],
  },
  {
    id: 4,
    part: 1,
    text: "At each step, can you specify the output schema in advance — fixed fields, fixed format?",
    examples: [
      `An invoice extractor always returns vendor, amount, due date, and line items — same fields every time. Not: "sometimes a paragraph, sometimes a table, depending on what the LLM decides."`,
      `A two-step lead qualifier: pull company, role, and intent from the inbound email, then score it on fit, urgency, and budget. Same fields every time.`,
      `A receipt-parsing pipeline that always emits the same row shape — vendor, date, total, tax, currency — even when the source receipts look completely different.`,
    ],
  },
  {
    id: 5,
    part: 2,
    text: "Does the system need to decide, based on intermediate results, what to do next?",
    noHint:
      "Answer no if every run follows the same fixed path, regardless of what comes back.",
    examples: [
      `A Deep Research agent reads a source, decides whether to search for more, decides when it has enough to write up — the path branches with every finding. (Perplexity Deep Research, OpenAI deep research, and similar systems all use this pattern.)`,
      `A bug-fixing assistant reads the test output, decides whether to inspect the logs or open the source, and might re-run the test to verify. Every step's choice depends on what the last step revealed.`,
      `An analytics agent runs a query, sees something unexpected in the result, and decides whether the next move is a follow-up query, a join with another table, or asking the user a clarifying question.`,
    ],
  },
  {
    id: 6,
    part: 2,
    text: "Does the task require calling tools in an order you can't predict in advance?",
    noHint:
      "Answer no if the same tools fire in the same order every run.",
    examples: [
      `A coding assistant might read a file, run tests, edit code, read another file, run tests again — or might do that in reverse. You can't write the sequence down ahead of time.`,
      `A security incident responder pulls logs, reads alerts, queries the user directory, then reads more logs — the order depends entirely on what each query reveals about the next thread to pull.`,
      `A computer-use agent navigating a website: click, screenshot, scroll, type, screenshot again — the order depends on what's actually on the screen at each step.`,
    ],
  },
  {
    id: 7,
    part: 2,
    text: "Does the system need to recognize on its own when the task is finished?",
    examples: [
      `"Fix this bug" — the system has to decide when the fix is good enough to stop. There's no fixed step count, and "done" is itself a judgment call.`,
      `"Find out why this metric dropped last week" — done is when the system has enough evidence to write up a credible explanation. No predetermined number of steps.`,
      `"Build a working prototype for this idea" — done is when the system decides it's good enough to show someone. No fixed checklist tells it when to stop.`,
    ],
  },
  {
    id: 8,
    part: 2,
    text: "Have you tried the simplest non-agent version, or clearly proven why it cannot handle the cases you care about?",
    examples: [
      `You shipped a single-prompt version, watched real users use it, and identified specific failure modes a workflow couldn't fix. Not "I have a hunch we'll need an agent."`,
      `You ran a single-prompt version internally for two weeks, logged the failures, and the failure modes are structural — not "we should tune the prompt better."`,
      `You wrote out the fixed workflow on paper and can point to specific cases no static sequence handles.`,
    ],
  },
  {
    id: 9,
    part: 2,
    text: "Could a wrong action be safely undone without human cleanup?",
    examples: [
      `Reversible: a research agent generates a summary — if it's wrong, you re-read the source and nothing else happened. Not reversible: a trading bot submits an order, a customer-service agent sends an email, a coding agent pushes to production. Once the action happens, undoing it costs time, money, or trust.`,
      `Reversible: generating draft text that a human reviews before sending. Not reversible: posting directly to Slack, charging a card, deploying code. Once it's out, it's out.`,
      `Reversible: writing to a sandbox database that gets wiped nightly. Not reversible: modifying production rows, calling third-party APIs that move money, granting permissions.`,
    ],
  },
];
