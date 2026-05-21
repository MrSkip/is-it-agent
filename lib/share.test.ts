import { describe, expect, it } from "vitest";
import { buildReport, decodeAnswers, encodeAnswers } from "./share";
import type { Recommendation } from "./recommend";

describe("encodeAnswers", () => {
  it("encodes all-yes as yyyyyyyyy", () => {
    expect(
      encodeAnswers({
        1: "yes",
        2: "yes",
        3: "yes",
        4: "yes",
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "yes",
      }),
    ).toBe("yyyyyyyyy");
  });

  it("encodes all-no as nnnnnnnnn", () => {
    expect(
      encodeAnswers({
        1: "no",
        2: "no",
        3: "no",
        4: "no",
        5: "no",
        6: "no",
        7: "no",
        8: "no",
        9: "no",
      }),
    ).toBe("nnnnnnnnn");
  });

  it("encodes in question-id order", () => {
    expect(
      encodeAnswers({
        1: "yes",
        2: "no",
        3: "yes",
        4: "no",
        5: "yes",
        6: "no",
        7: "yes",
        8: "no",
        9: "yes",
      }),
    ).toBe("ynynynyny");
  });

  it("returns null if any answer is missing", () => {
    expect(encodeAnswers({ 1: "yes", 2: "yes" })).toBe(null);
  });

  it("returns null for empty answers", () => {
    expect(encodeAnswers({})).toBe(null);
  });
});

describe("decodeAnswers", () => {
  it("decodes yyyyyyyyy into all-yes", () => {
    expect(decodeAnswers("yyyyyyyyy")).toEqual({
      1: "yes",
      2: "yes",
      3: "yes",
      4: "yes",
      5: "yes",
      6: "yes",
      7: "yes",
      8: "yes",
      9: "yes",
    });
  });

  it("rejects empty string", () => {
    expect(decodeAnswers("")).toBe(null);
  });

  it("rejects strings of wrong length", () => {
    expect(decodeAnswers("yyyy")).toBe(null);
    expect(decodeAnswers("yyyyyyyyyy")).toBe(null);
  });

  it("rejects strings with invalid characters", () => {
    expect(decodeAnswers("yyyzyynnn")).toBe(null);
    expect(decodeAnswers("YYYYYYYYY")).toBe(null);
    expect(decodeAnswers("yy yyyy nn")).toBe(null);
  });

  it("round-trips encode → decode", () => {
    const original = {
      1: "yes",
      2: "no",
      3: "yes",
      4: "no",
      5: "yes",
      6: "no",
      7: "yes",
      8: "no",
      9: "yes",
    } as const;
    const code = encodeAnswers(original);
    expect(code).not.toBe(null);
    expect(decodeAnswers(code!)).toEqual(original);
  });
});

describe("buildReport", () => {
  const baseResult: Recommendation = {
    verdict: "agent",
    title: "Agent",
    trace: "You said yes to Q5, Q6, Q7 — that's an agent shape.",
    rationale: "An agent runs a loop: act → observe → decide → repeat.",
    guidance: [],
  };

  it("includes verdict title, trace, and rationale", () => {
    const report = buildReport(baseResult, "");
    expect(report).toContain("Verdict: Agent");
    expect(report).toContain("You said yes to Q5, Q6, Q7");
    expect(report).toContain("act → observe → decide");
  });

  it("includes guidance items when present", () => {
    const report = buildReport(
      {
        ...baseResult,
        guidance: [
          {
            title: "Start with the simple version first",
            trace: "You said no to Q8.",
            body: "Some longer body text.",
          },
        ],
      },
      "",
    );
    expect(report).toContain("Also worth flagging");
    expect(report).toContain("Start with the simple version first");
    expect(report).toContain("You said no to Q8.");
  });

  it("omits the guidance section when there are no items", () => {
    const report = buildReport(baseResult, "");
    expect(report).not.toContain("Also worth flagging");
  });

  it("appends URL when provided", () => {
    const report = buildReport(
      baseResult,
      "https://example.com/quiz?a=nnnnyyynn",
    );
    expect(report).toContain("https://example.com/quiz?a=nnnnyyynn");
  });

  it("omits URL line when empty string is passed", () => {
    const report = buildReport(baseResult, "");
    expect(report.endsWith(baseResult.rationale)).toBe(true);
  });
});
