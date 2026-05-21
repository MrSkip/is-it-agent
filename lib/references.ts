export type ReferenceCategory = "foundational" | "production";

export type Reference = {
  title: string;
  author: string;
  date: string;
  url: string;
  category: ReferenceCategory;
  note: string;
};

export const referenceCategories: {
  id: ReferenceCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "foundational",
    label: "Foundational",
    description: "Start here. The canonical taxonomy and consensus definitions.",
  },
  {
    id: "production",
    label: "Production & safety",
    description: "What changes when you actually try to ship and operate one of these.",
  },
];

export const references: Reference[] = [
  {
    title: "Building Effective Agents",
    author: "Anthropic",
    date: "December 2024",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
    category: "foundational",
    note: "The article this quiz is built on. Original taxonomy of single call vs workflow vs agent, plus the named workflow patterns (routing, chaining, orchestrator-workers). Short, opinionated, the single highest-leverage read.",
  },
  {
    title: "I think ‘agent’ may finally have a widely enough agreed upon definition",
    author: "Simon Willison",
    date: "September 2025",
    url: "https://simonwillison.net/2025/Sep/18/agents/",
    category: "foundational",
    note: "Crystallizes the field's consensus into one sentence: “an LLM agent runs tools in a loop to achieve a goal.” A short, accessible read with helpful framing for non-practitioners.",
  },
  {
    title: "A Practical Guide to Building Agents",
    author: "OpenAI",
    date: "2025",
    url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
    category: "foundational",
    note: "OpenAI's own framework for deciding when to build an agent. Uses the same single-call / workflow / agent split as Anthropic, with their own emphasis on guardrails and validation. PDF, ~30 pages.",
  },
  {
    title: "LangGraph — Workflows and Agents",
    author: "LangChain",
    date: "Updated regularly",
    url: "https://docs.langchain.com/oss/python/langgraph/workflows-agents",
    category: "foundational",
    note: "Practical, implementation-level treatment of the same patterns described in the Anthropic essay. Best read when you're ready to write code.",
  },
  {
    title: "Effective Context Engineering for AI Agents",
    author: "Anthropic",
    date: "September 2025",
    url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    category: "production",
    note: "What changes when you actually try to run an agent reliably. Tokens, memory, sub-agents, and the practical concerns that come up after the prototype works.",
  },
  {
    title: "Building Agents with the Claude Agent SDK",
    author: "Anthropic",
    date: "September 2025",
    url: "https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk",
    category: "production",
    note: "The “how” once you've decided you actually need an agent. Concrete patterns for the loop, tool definitions, error handling, and shipping behavior.",
  },
  {
    title: "Demystifying Evals for AI Agents",
    author: "Anthropic",
    date: "January 2026",
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
    category: "production",
    note: `What "good" actually means for an agent across a multi-step trajectory, and how to define rubrics you can automate. Pairs with the Eval glossary entry — if you can't write this, you can't safely run an agent.`,
  },
  {
    title: "OWASP Top 10 for Agentic Applications 2026",
    author: "OWASP GenAI Security Project",
    date: "December 2025",
    url: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/",
    category: "production",
    note: "The security threats unique to agents. Specifically ASI02 (tool misuse) and ASI08 (cascading failures) map directly to the Q9 blast-radius question; ASI05 (unexpected code execution) is the canonical case for human-in-the-loop on any agent that runs code. Read before shipping anything that takes real actions.",
  },
  {
    title: "Practical Lessons from 750+ Real-World LLM and Agent Deployments",
    author: "Hugo Bowne-Anderson",
    date: "2025",
    url: "https://hugobowne.substack.com/p/practical-lessons-from-750-real-world",
    category: "production",
    note: "What actually works in production, across a large sample of deployments. Patterns that survive contact with real users — mostly: heavy constraints, narrow scopes, evals from day one.",
  },
  {
    title: "The Case for Bounded Autonomy",
    author: "MongoDB Engineering",
    date: "2025–2026",
    url: "https://www.mongodb.com/company/blog/technical/the-case-for-bounded-autonomy",
    category: "production",
    note: "Argues for earning agent autonomy incrementally rather than treating “agent” as a binary architectural choice. Useful framing for the Q8/Q9 overlays in the quiz.",
  },
];
