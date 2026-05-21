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
    text: "Is the set of user inputs bounded — i.e., users will mostly do a small number of known things?",
    example:
      `A support bot that handles "where's my order," "return this item," and "change my address." Not "plan my European vacation."`,
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
    text: "Is the output predictable in shape — same fields, same format, every time?",
    example:
      `Always returns JSON with {name, amount, due_date}. Not "sometimes a paragraph, sometimes a table, depending on the question."`,
  },
  {
    id: 5,
    part: 2,
    text: "Does the system need to decide, based on intermediate results, what to do next?",
    example:
      `A research assistant reads a paper, decides it needs more context, searches for related work, then decides whether to keep going or summarize. The path branches based on what it finds.`,
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
];
