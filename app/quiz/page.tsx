"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { questions, type Question } from "@/lib/questions";
import {
  recommend,
  type Answer,
  type Answers,
  type Verdict,
} from "@/lib/recommend";
import { buildReport, decodeAnswers, encodeAnswers } from "@/lib/share";

const verdictBlurb: Record<Verdict, { slug: string; label: string }> = {
  "single-call": {
    slug: "single-llm-call",
    label: "What is a single LLM call?",
  },
  workflow: { slug: "workflow", label: "What is a workflow?" },
  agent: { slug: "agent", label: "What is an agent?" },
};

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizContent />
    </Suspense>
  );
}

function QuizLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <p className="text-sm text-muted">Loading…</p>
    </main>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    const code = searchParams.get("a");
    return (code ? decodeAnswers(code) : null) ?? {};
  });
  const [done, setDone] = useState(() => {
    const code = searchParams.get("a");
    return code !== null && decodeAnswers(code) !== null;
  });

  const current = questions[index];
  const total = questions.length;

  function answer(value: Answer) {
    const next: Answers = { ...answers, [current.id]: value };
    setAnswers(next);
    if (index === total - 1) {
      const code = encodeAnswers(next);
      if (code) router.replace(`/quiz?a=${code}`);
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  }

  function goBack() {
    if (index > 0) setIndex(index - 1);
  }

  function startOver() {
    setIndex(0);
    setAnswers({});
    setDone(false);
    router.replace("/quiz");
  }

  if (done) {
    return <ResultView answers={answers} onStartOver={startOver} />;
  }

  return (
    <QuestionView
      key={current.id}
      question={current}
      index={index}
      total={total}
      previousAnswer={answers[current.id]}
      onAnswer={answer}
      onBack={goBack}
    />
  );
}

function QuestionView({
  question,
  index,
  total,
  previousAnswer,
  onAnswer,
  onBack,
}: {
  question: Question;
  index: number;
  total: number;
  previousAnswer: Answer | undefined;
  onAnswer: (v: Answer) => void;
  onBack: () => void;
}) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const partLabel =
    question.part === 1
      ? "Part 1 — Define the problem"
      : "Part 2 — Pressure-test the agent case";

  return (
    <main className="min-h-screen flex flex-col px-6 py-12">
      <div className="max-w-xl w-full mx-auto flex-1 flex flex-col">
        <div className="mb-12">
          <div className="flex justify-between items-center text-xs uppercase tracking-wider text-muted mb-3">
            <span>
              Question {index + 1} of {total}
            </span>
            <span>{partLabel}</span>
          </div>
          <div className="h-px bg-line relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-ink transition-all duration-300"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm uppercase tracking-wider text-muted mb-3">
            Q{question.id}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            {question.text}
          </h2>
          <p
            className={`text-base leading-relaxed text-muted ${
              question.examples.length > 1 ? "mb-3" : "mb-10"
            }`}
          >
            <span className="font-medium text-ink">Example.</span>{" "}
            {question.examples[exampleIndex]}
          </p>
          {question.examples.length > 1 && (
            <div className="flex items-center gap-2 mb-10">
              <div className="flex gap-1.5">
                {question.examples.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setExampleIndex(i)}
                    aria-label={`Show example ${i + 1}`}
                    aria-current={i === exampleIndex ? "true" : undefined}
                    className="group p-1"
                  >
                    <span
                      className={`block w-2 h-2 rounded-full transition ${
                        i === exampleIndex
                          ? "bg-ink"
                          : "bg-line group-hover:bg-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs uppercase tracking-wider text-muted">
                Example {exampleIndex + 1} of {question.examples.length}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onAnswer("yes")}
              className={`flex-1 py-3 px-6 rounded-md border transition ${
                previousAnswer === "yes"
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent border-line hover:border-ink"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => onAnswer("no")}
              className={`flex-1 py-3 px-6 rounded-md border transition ${
                previousAnswer === "no"
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent border-line hover:border-ink"
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center text-sm">
          {index > 0 ? (
            <button
              onClick={onBack}
              className="text-muted hover:text-ink transition"
            >
              ← Back
            </button>
          ) : (
            <Link href="/" className="text-muted hover:text-ink transition">
              ← Home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

function ResultView({
  answers,
  onStartOver,
}: {
  answers: Answers;
  onStartOver: () => void;
}) {
  const result = recommend(answers);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const url = typeof window !== "undefined" ? window.location.href : "";
  const report = buildReport(result, url);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(report);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
    }
  }

  const copyButtonLabel =
    copyState === "copied"
      ? "Copied!"
      : copyState === "failed"
        ? "Copy failed"
        : "Copy report";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full">
        <p className="text-sm uppercase tracking-wider text-muted mb-3">
          Verdict
        </p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-2">
          {result.title}
        </h1>
        <Link
          href={`/glossary#${verdictBlurb[result.verdict].slug}`}
          className="inline-block text-sm text-muted hover:text-ink transition underline underline-offset-4 mb-8"
        >
          {verdictBlurb[result.verdict].label}
        </Link>
        <p className="text-base leading-relaxed text-ink mb-6 pl-4 border-l-2 border-ink">
          {result.trace}
        </p>
        <p className="text-lg leading-relaxed text-muted mb-10">
          {result.rationale}
        </p>

        <div className="mb-10">
          <p className="text-sm uppercase tracking-wider text-muted mb-5">
            Build this first
          </p>
          <ol className="space-y-4">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-xs uppercase tracking-wider text-muted shrink-0 mt-1.5 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base text-ink leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {result.guidance.length > 0 && (
          <div className="mb-10">
            <p className="text-sm uppercase tracking-wider text-muted mb-4">
              Also worth flagging
            </p>
            <div className="space-y-6">
              {result.guidance.map((g, i) => (
                <div key={i} className="border-l-2 border-line pl-4">
                  <h3 className="font-medium text-ink mb-1">{g.title}</h3>
                  <p className="text-xs text-muted mb-3">{g.trace}</p>
                  <p className="text-sm leading-relaxed text-muted">{g.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <details className="mb-10 group">
          <summary className="cursor-pointer text-sm text-muted hover:text-ink transition list-none flex items-center gap-2">
            <span className="inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            Show all answers
          </summary>
          <ul className="mt-4 space-y-2 text-sm">
            {questions.map((q) => (
              <li key={q.id} className="flex gap-3">
                <span className="text-muted w-8 shrink-0">Q{q.id}</span>
                <span className="font-medium w-10 capitalize shrink-0">
                  {answers[q.id]}
                </span>
                <span className="text-muted flex-1">{q.text}</span>
              </li>
            ))}
          </ul>
        </details>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className="inline-block bg-ink text-cream px-6 py-3 rounded-md font-medium hover:opacity-90 transition min-w-32"
          >
            {copyButtonLabel}
          </button>
          <button
            onClick={onStartOver}
            className="inline-block bg-transparent border border-line text-ink px-6 py-3 rounded-md font-medium hover:border-ink transition"
          >
            Start over
          </button>
          <Link
            href="/"
            className="inline-block bg-transparent border border-line text-ink px-6 py-3 rounded-md font-medium hover:border-ink transition"
          >
            Home
          </Link>
        </div>
        {copyState === "failed" && (
          <div className="mt-6">
            <p className="text-sm text-muted mb-2">
              Clipboard access is blocked. Select the text below to copy
              manually:
            </p>
            <textarea
              readOnly
              value={report}
              onClick={(e) => e.currentTarget.select()}
              className="w-full h-48 p-3 border border-line rounded-md text-sm font-mono bg-cream"
            />
          </div>
        )}
        <p className="text-sm text-muted mt-10 leading-relaxed">
          Want to dig deeper?{" "}
          <Link
            href="/glossary"
            className="underline underline-offset-4 hover:text-ink transition"
          >
            Glossary &amp; references
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
