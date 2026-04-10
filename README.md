# BuildBrief 🚀

**From Vague Idea to Production-Ready Spec — in minutes, not weeks.**

BuildBrief is an AI-powered interview app that transforms half-baked app ideas into comprehensive "Mega-Prompt" specifications. Designed for vibecoders — people building apps with AI tools like Cursor, Windsurf, and Bolt — it acts as a Senior Technical Product Manager, asking the right questions, making smart decisions automatically, and producing a spec document you can hand directly to an AI coding agent.

## ✨ Features

- **AI-Driven Interview** — A dynamic 5–10 question flow that adapts based on your project's complexity. No fixed questionnaire.
- **Idea Analysis** — Validates your concept immediately with a vision statement, implementation approaches, and honest cautions.
- **Auto-Decisions** — The AI makes non-critical technical decisions for you (database type, auth method, folder structure) and shows them in a live sidebar.
- **Target-Specific Exports** — Export your spec formatted for Cursor (`.cursorrules`), Windsurf (`.windsurfrules`), or Bolt, or download as Markdown.
- **Task Breakdown** — Post-spec AI-generated implementation checklist with phases, priorities, and time estimates. Interactive — check off tasks as you build.
- **Starter Prompt** — A ready-to-paste first message for your AI coder, generated alongside the spec.
- **Session Persistence** — Your interview progress survives tab closes and page refreshes (localStorage with 24h expiry).
- **Error Recovery** — Automatic retries with visual feedback. Go Back and Start Over buttons at every step.
- **Existing Project Support** — "I have an existing project" mode that focuses on extensions, not starting from scratch.
- **Aurora Design System** — A premium glassmorphic dark/light UI with Clash Display typography and subtle grain textures.

## 🛠️ Tech Stack

**Client**
- React 18 + Vite 5
- TypeScript (strict mode)
- Tailwind CSS v4 + Aurora design system
- Framer Motion (animations)
- Lucide React (icons)
- React Markdown + React Router

**Server**
- Node.js + Express
- OpenRouter API (`xiaomi/mimo-v2-flash`)
- TypeScript (strict mode)
- Zod (request validation)
- Winston-style structured logger

**Shared**
- Unified type definitions in `shared/types.ts`
- Path aliases (`@shared/*`) configured in both client and server

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- An [OpenRouter API Key](https://openrouter.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arjun-arihant/BuildBrief.git
   cd buildbrief
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   Edit `.env` and set your `OPENROUTER_API_KEY`.

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   ```

### Running the App

1. **Start the Server** (Terminal 1)
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:3000`.

2. **Start the Client** (Terminal 2)
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`.

3. Open `http://localhost:5173` in your browser.

## 📖 How It Works

1. **Describe your idea** — "A Tinder for adopting rescue dogs" is enough.
2. **AI analyzes it** — You get a vision statement, suggested app name, and implementation approaches.
3. **Answer a few questions** — The AI asks only what matters architecturally (5–10 questions max).
4. **Review auto-decisions** — Watch the sidebar fill with smart defaults the AI chose for you.
5. **Get your spec** — A detailed Mega-Prompt covering user stories, data models, API design, and tech stack.
6. **Break into tasks** — Optional: generate a phased implementation checklist with time estimates.
7. **Export & build** — Download for Cursor/Windsurf/Bolt and start building immediately.

## 📁 Project Structure

```
buildbrief/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/  # UI components + templates
│       ├── hooks/       # usePersistedSession
│       ├── lib/         # exportFormats, utils
│       └── pages/       # LandingPage, AppPage
├── server/          # Express backend
│   └── src/
│       ├── index.ts     # Routes + middleware
│       ├── openrouter.ts # AI integration
│       ├── prompts.ts   # System prompts
│       └── state.ts     # In-memory session store
├── shared/          # Shared TypeScript types
│   └── types.ts
└── docs/            # GitHub Pages site
```

## 📄 License

MIT
