import { describe, expect, it } from "vitest";
import { recommend, type Answer, type Answers } from "./recommend";

function answers(overrides: Partial<Record<number, Answer>> = {}): Answers {
  const base: Answers = {
    1: "yes",
    2: "yes",
    3: "yes",
    4: "yes",
    5: "yes",
    6: "yes",
    7: "yes",
    8: "yes",
    9: "yes",
  };
  return { ...base, ...overrides };
}

function allNo(): Answers {
  return {
    1: "no",
    2: "no",
    3: "no",
    4: "no",
    5: "no",
    6: "no",
    7: "no",
    8: "no",
    9: "no",
  };
}

describe("recommend()", () => {
  describe("single-call verdict", () => {
    it("returns single-call when Q3 is yes", () => {
      const r = recommend(answers({ 3: "yes" }));
      expect(r.verdict).toBe("single-call");
      expect(r.title).toBe("Single LLM call");
    });

    it("prefers single-call over agent shape (Q3 takes precedence over Part 2 majority)", () => {
      const r = recommend({
        ...allNo(),
        3: "yes",
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("single-call");
    });

    it("trace cites Q3 specifically", () => {
      const r = recommend(answers({ 3: "yes" }));
      expect(r.trace).toContain("Q3");
    });
  });

  describe("agent verdict", () => {
    it("returns agent when all Part 2 yes and all Part 1 no", () => {
      const r = recommend({
        ...allNo(),
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("agent");
      expect(r.title).toBe("Agent");
    });

    it("returns agent with 2/3 Part 2 yes and 1/3 Part 1 yes", () => {
      const r = recommend({
        1: "yes",
        2: "no",
        3: "no",
        4: "no",
        5: "yes",
        6: "yes",
        7: "no",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("agent");
    });

    it("trace names the driving Part 2 yeses and Part 1 nos", () => {
      const r = recommend({
        ...allNo(),
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "yes",
      });
      expect(r.trace).toContain("yes to Q5, Q6, Q7");
      expect(r.trace).toContain("no to Q1, Q2, Q4");
    });

    it("rationale mentions the agent loop and the routing-workflow pitfall", () => {
      const r = recommend({
        ...allNo(),
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "yes",
      });
      expect(r.rationale).toContain("act → observe → decide");
      expect(r.rationale).toContain("routing workflow");
    });
  });

  describe("workflow verdict", () => {
    it("returns workflow when Part 1 yes (except Q3) and Part 2 no", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "no",
        6: "no",
        7: "no",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("workflow");
      expect(r.title).toBe("Workflow");
    });

    it("returns workflow when Part 2 yes count < 2", () => {
      const r = recommend({
        ...allNo(),
        5: "yes",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("workflow");
    });
  });

  describe("conflicting signals on workflow verdict", () => {
    it("surfaces both Part 1 and Part 2 yeses when both halves vote opposite shapes", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "yes",
        6: "yes",
        7: "no",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("workflow");
      expect(r.trace).toContain("Q1, Q2, Q4");
      expect(r.trace).toContain("Q5, Q6");
      expect(r.trace).toContain("conflict");
    });

    it("rationale explains why workflow wins and prompts re-examination", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "no",
        5: "yes",
        6: "yes",
        7: "no",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("workflow");
      expect(r.rationale).toContain("Re-read");
      expect(r.rationale).toContain("Part 1");
      expect(r.rationale).toContain("Part 2");
    });

    it("does not trigger conflict mode when only one Part 2 yes", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "yes",
        6: "no",
        7: "no",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("workflow");
      expect(r.trace).not.toContain("conflict");
    });

    it("does not trigger conflict mode when only one Part 1 yes", () => {
      const r = recommend({
        1: "yes",
        2: "no",
        3: "no",
        4: "no",
        5: "yes",
        6: "yes",
        7: "no",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("agent");
    });

    it("handles maximum conflict (all Part 1 yes and all Part 2 yes)", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "yes",
      });
      expect(r.verdict).toBe("workflow");
      expect(r.trace).toContain("Q1, Q2, Q4");
      expect(r.trace).toContain("Q5, Q6, Q7");
      expect(r.trace).toContain("conflict");
      expect(r.rationale).toContain("Re-read");
    });
  });

  describe("Q8 = no overlay (start simple)", () => {
    it("adds simple-first guidance for workflow verdict", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "no",
        6: "no",
        7: "no",
        8: "no",
        9: "yes",
      });
      expect(r.guidance.some((g) => g.title.includes("simple"))).toBe(true);
    });

    it("adds simple-first guidance for agent verdict", () => {
      const r = recommend({
        ...allNo(),
        5: "yes",
        6: "yes",
        7: "yes",
        8: "no",
        9: "yes",
      });
      expect(r.guidance.some((g) => g.title.includes("simple"))).toBe(true);
    });

    it("suppresses simple-first guidance for single-call (would be tautological)", () => {
      const r = recommend(answers({ 3: "yes", 8: "no" }));
      expect(r.verdict).toBe("single-call");
      expect(r.guidance.some((g) => g.title.includes("simple"))).toBe(false);
    });
  });

  describe("Q9 = no overlay (HITL for irreversible)", () => {
    it("adds HITL guidance for single-call verdict", () => {
      const r = recommend(answers({ 3: "yes", 9: "no" }));
      expect(
        r.guidance.some((g) => g.title.includes("human-in-the-loop")),
      ).toBe(true);
    });

    it("adds HITL guidance for workflow verdict", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "no",
        6: "no",
        7: "no",
        8: "yes",
        9: "no",
      });
      expect(
        r.guidance.some((g) => g.title.includes("human-in-the-loop")),
      ).toBe(true);
    });

    it("adds HITL guidance for agent verdict", () => {
      const r = recommend({
        ...allNo(),
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "no",
      });
      expect(
        r.guidance.some((g) => g.title.includes("human-in-the-loop")),
      ).toBe(true);
    });
  });

  describe("stacked overlays and no-overlay cases", () => {
    it("returns both Q8 and Q9 guidance when both are no on a workflow verdict", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "no",
        6: "no",
        7: "no",
        8: "no",
        9: "no",
      });
      expect(r.verdict).toBe("workflow");
      expect(r.guidance).toHaveLength(2);
    });

    it("returns only HITL guidance for single-call with Q8=no, Q9=no (Q8 suppressed)", () => {
      const r = recommend(answers({ 3: "yes", 8: "no", 9: "no" }));
      expect(r.verdict).toBe("single-call");
      expect(r.guidance).toHaveLength(1);
      expect(r.guidance[0].title).toContain("human-in-the-loop");
    });

    it("returns no guidance when Q8=yes and Q9=yes", () => {
      const r = recommend(answers());
      expect(r.guidance).toHaveLength(0);
    });
  });

  describe("trace strings always cite specific question IDs", () => {
    it("agent trace references Q5/Q6/Q7", () => {
      const r = recommend({
        ...allNo(),
        5: "yes",
        6: "yes",
        7: "yes",
        8: "yes",
        9: "yes",
      });
      expect(r.trace).toMatch(/Q[567]/);
    });

    it("workflow trace references Part 1 yes or Part 2 no questions", () => {
      const r = recommend({
        1: "yes",
        2: "yes",
        3: "no",
        4: "yes",
        5: "no",
        6: "no",
        7: "no",
        8: "yes",
        9: "yes",
      });
      expect(r.trace).toMatch(/Q[1247]/);
      expect(r.trace).not.toContain("conflict");
    });
  });
});
