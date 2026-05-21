# Is it an agent?

Nine yes/no questions to decide whether your problem actually needs an agent — or just a single LLM call or a workflow.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy to Vercel

The fastest path:

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new>, import the repo, click Deploy. Vercel auto-detects Next.js — no config needed.

Or via CLI from the project root:

```bash
npx vercel
```

No environment variables, no database, no API keys. The recommendation logic runs entirely in the browser.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript

## Structure

- `lib/questions.ts` — the nine questions and their examples
- `lib/recommend.ts` — the decision logic. Q3 = yes routes to single-call; otherwise a 3-vs-3 majority between Part 2 (Q5–Q7) and Part 1 (Q1, Q2, Q4) decides agent vs workflow. Q8 ("ship simple first") and Q9 ("blast radius") are guidance overlays appended to the verdict, not terminal answers
- `app/page.tsx` — landing
- `app/quiz/page.tsx` — quiz and result, all client-side state
- `app/glossary/page.tsx` — glossary of terms + references for further reading
- `lib/glossary.ts`, `lib/references.ts` — data for the glossary page
