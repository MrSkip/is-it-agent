import type { Metadata } from "next";
import Link from "next/link";
import { categories, terms } from "@/lib/glossary";
import { referenceCategories, references } from "@/lib/references";

export const metadata: Metadata = {
  title: "Glossary — Is it an agent?",
  description:
    "A short working vocabulary for deciding whether to build an agent, plus the canonical references.",
};

export default function GlossaryPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl w-full mx-auto">
        <Link
          href="/"
          className="text-sm text-muted hover:text-ink transition mb-12 inline-block"
        >
          ← Home
        </Link>

        <p className="text-sm uppercase tracking-wider text-muted mb-3">
          Glossary
        </p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
          The working vocabulary
        </h1>
        <p className="text-lg leading-relaxed text-muted mb-16">
          Thirteen terms that come up when deciding whether to build an agent.
          Short definitions, with the distinctions that actually matter in
          practice. Skim or read in order.
        </p>

        {categories.map((category) => {
          const categoryTerms = terms.filter((t) => t.category === category.id);
          return (
            <section key={category.id} className="mb-16">
              <p className="text-sm uppercase tracking-wider text-muted mb-2">
                {category.label}
              </p>
              <p className="text-base text-muted mb-10">
                {category.description}
              </p>
              <div className="space-y-12">
                {categoryTerms.map((term) => (
                  <article
                    key={term.slug}
                    id={term.slug}
                    className="scroll-mt-12"
                  >
                    <h2 className="font-serif text-2xl md:text-3xl mb-3">
                      {term.name}
                    </h2>
                    <p className="text-base text-ink leading-relaxed mb-3">
                      {term.short}
                    </p>
                    <p className="text-base text-muted leading-relaxed">
                      {term.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-24 pt-12 border-t border-line">
          <p className="text-sm uppercase tracking-wider text-muted mb-3">
            Further reading
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            References
          </h2>
          <p className="text-lg leading-relaxed text-muted mb-12">
            All free except where noted. Listed roughly in the order you'd want
            to read them.
          </p>

          {referenceCategories.map((refCategory) => {
            const items = references.filter(
              (r) => r.category === refCategory.id,
            );
            return (
              <div key={refCategory.id} className="mb-14">
                <p className="text-sm uppercase tracking-wider text-muted mb-2">
                  {refCategory.label}
                </p>
                <p className="text-base text-muted mb-8">
                  {refCategory.description}
                </p>
                <div className="space-y-8">
                  {items.map((ref) => (
                    <div key={ref.url}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink underline underline-offset-4 hover:text-muted transition font-medium text-base"
                      >
                        {ref.title}
                      </a>
                      <p className="text-sm text-muted mt-1">
                        {ref.author} — {ref.date}
                      </p>
                      <p className="text-sm text-muted leading-relaxed mt-2">
                        {ref.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-20 pt-12 border-t border-line flex flex-wrap gap-3">
          <Link
            href="/quiz"
            className="inline-block bg-ink text-cream px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
          >
            Take the quiz →
          </Link>
          <Link
            href="/"
            className="inline-block bg-transparent border border-line text-ink px-6 py-3 rounded-md font-medium hover:border-ink transition"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
