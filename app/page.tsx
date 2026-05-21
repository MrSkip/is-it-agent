import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full">
        <p className="text-sm tracking-wider uppercase text-muted mb-6">
          Eight yes/no questions
        </p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-8">
          Is it an agent?
        </h1>
        <p className="text-lg leading-relaxed text-ink mb-4">
          Most things called &ldquo;agents&rdquo; are workflows. Most workflows are
          really a single LLM call wearing a costume.
        </p>
        <p className="text-lg leading-relaxed text-muted mb-10">
          Eight binary questions. You&rsquo;ll land on one of four answers, and
          you&rsquo;ll see exactly which questions drove the verdict.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-ink text-cream px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
        >
          Start →
        </Link>
      </div>
    </main>
  );
}
