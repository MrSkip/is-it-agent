import { questions } from "./questions";
import type { Answers, Recommendation } from "./recommend";

const QUESTION_IDS = questions.map((q) => q.id);
const CODE_PATTERN = new RegExp(`^[yn]{${QUESTION_IDS.length}}$`);

export function encodeAnswers(answers: Answers): string | null {
  for (const id of QUESTION_IDS) {
    const a = answers[id];
    if (a !== "yes" && a !== "no") return null;
  }
  return QUESTION_IDS.map((id) => (answers[id] === "yes" ? "y" : "n")).join(
    "",
  );
}

export function decodeAnswers(code: string): Answers | null {
  if (!CODE_PATTERN.test(code)) return null;
  const result: Answers = {};
  QUESTION_IDS.forEach((id, i) => {
    result[id] = code[i] === "y" ? "yes" : "no";
  });
  return result;
}

export function buildReport(result: Recommendation, url: string): string {
  const lines: string[] = [];
  lines.push(`Is it an agent? — Verdict: ${result.title}`);
  lines.push(result.trace);
  lines.push("");
  lines.push(result.rationale);
  lines.push("");
  lines.push(`Rough effort: ${result.effort}`);
  lines.push(`What this isn't: ${result.notThis}`);
  lines.push(`Common misread: ${result.commonMisread}`);

  if (result.nextSteps.length > 0) {
    lines.push("");
    lines.push("Build this first:");
    result.nextSteps.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });
  }

  if (result.guidance.length > 0) {
    lines.push("");
    lines.push("Also worth flagging:");
    for (const g of result.guidance) {
      lines.push(`- ${g.title}`);
      lines.push(`  ${g.trace}`);
    }
  }

  if (url) {
    lines.push("");
    lines.push(url);
  }

  return lines.join("\n");
}
