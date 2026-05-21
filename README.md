# Is it an agent?

Eight yes/no questions to decide whether your problem actually needs an agent — or just a single LLM call or a workflow.

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

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript

## Structure

- `lib/questions.ts` — the eight questions and their examples
- `lib/recommend.ts` — the decision logic (Q8 = no overrides everything, Q3 = yes routes to single-call, then a 3-vs-3 majority decides agent vs workflow)
- `app/page.tsx` — landing
- `app/quiz/page.tsx` — quiz and result, all client-side state
