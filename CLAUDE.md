# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Client (Frontend)
```bash
cd client
npm run dev       # Start Vite dev server on port 5173
npm run build     # Type-check + build to dist/
npm run preview   # Preview production build
```

### Server (Backend)
```bash
cd server
npm run dev       # Start with tsx (hot-reload) on port 3000
npm run build     # Compile TypeScript to dist/
npm run start     # Run compiled output
npm run lint      # Type-check without emitting
```

### Running Both Together
Open two terminals — one for `client/`, one for `server/`. The Vite dev server proxies `/api/*` to `http://localhost:3000`.

## Environment Setup

Copy `server/.env.example` to `server/.env` and set:
- `OPENROUTER_API_KEY` — required for AI functionality
- `PORT` — defaults to 3000
- `SITE_URL` — used in OpenRouter API headers
- `ALLOWED_ORIGINS` — comma-separated CORS origins

## Architecture

BuildBrief is a full-stack AI app that conducts an interview with the user and generates a "Mega-Prompt" software specification. The frontend (`/app` route) drives a multi-step conversation via API calls; the backend manages sessions and calls OpenRouter for AI responses.

### Shared Types (`shared/types.ts`)

All types are defined in `shared/types.ts` and re-exported by both client and server. Path alias `@shared/*` is configured in `client/tsconfig.json` and `client/vite.config.ts`. The server imports directly via relative path `../../shared/types`.

Key types:
- `AIResponse` — template-based response with `content`, `auto_decisions[]`, `progress`, `project_state_updates`
- `UIContent` — union of all template content shapes including `idea_analysis`, `free_text`, `single_choice`, `multi_choice`, `explanation_only`, `manual_action`, `summary`, `final_output`
- `ProjectState` — server-side session with `idea_summary`, `resolved_decisions`, `history[]`, `is_complete`

### Frontend (`client/src/`)

- **Entry:** `main.tsx` → `App.tsx` (routes)
- **Routes:** `/` uses `<Layout>` wrapper; `/app` is full-screen with no layout
- **`AppPage.tsx`** — Core interactive page. Manages all session state via `usePersistedSession` hook. Drives the interview loop via fetch calls to `/api/init`, `/api/answer`, `/api/refine`
- **`TemplateRenderer.tsx`** — Dispatches AI responses to the correct component based on `template` field
- **Templates:** `IdeaAnalysis`, `FreeText`, `Choice`, `ManualAction`, `Explanation`, `FinalOutput` — each handles a specific AI response type
- **`FinalOutput.tsx`** — Post-spec view with tabbed UI (Overview, Mega-Prompt, What's Next, Setup Guides), target-specific export dropdown, task breakdown with interactive checklist, and refinement input
- **`usePersistedSession`** — localStorage-based session persistence with 24h expiry, save/load/clear operations
- **`AutoDecisionsSidebar`** — Accumulated auto-decisions display, grouped by "New This Step" vs "Previous". Mobile: floating badge with tap-to-expand
- **Theme:** `ThemeContext.tsx` manages dark/light/system mode with localStorage persistence
- **Design System:** Aurora theme with `aurora-*` Tailwind tokens. CSS vars in `index.css`, Tailwind config in `tailwind.config.js`
- **Exports:** `lib/exportFormats.ts` — `formatForCursor()`, `formatForWindsurf()`, `formatForBolt()`, `downloadAsFile()`

### Backend (`server/src/`)

- **Entry:** `index.ts` — Express app wiring all routes and middleware
- **Session storage:** `state.ts` — in-memory `Map` keyed by UUID. Sessions are lost on server restart
- **AI integration:** `openrouter.ts` — uses the `openai` SDK pointed at OpenRouter; model is `xiaomi/mimo-v2-flash`. Exports `getNextStep()` for interview flow and `getTaskBreakdown()` for post-spec task generation
- **Prompts:** `prompts.ts` — `SYSTEM_PROMPT` (mega-prompt format, question categories, response schema), `getSystemPrompt()` (session context injection with dynamic limits), and `getTaskBreakdownPrompt()` (task decomposition from spec)
- **Validation:** `validation.ts` — Zod schemas for all request bodies:
  - `initProjectSchema` — idea: 5–2000 chars, optional existingContext: max 10000 chars
  - `answerSchema` — projectId (UUID) + answer: 1–5000 chars
  - `refineSchema` — projectId (UUID) + comments: 5–3000 chars
  - `taskBreakdownSchema` — projectId (UUID) + megaPrompt: 50–50000 chars + projectName: 1–200 chars
- **Rate limiting:** `rateLimiter.ts` — stricter limits on AI endpoints (`/api/init`, `/api/answer`, `/api/refine`, `/api/tasks`) vs. standard endpoints
- **Errors:** `errors.ts` — `ValidationError`, `NotFoundError`, `AppError` with a global error handler
- **Logging:** `logger.ts` — structured JSON logger with levels (debug, info, warn, error, fatal). Always use `logger.*()` instead of `console.*`

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/init` | Start new session with the user's idea |
| POST | `/api/answer` | Submit an answer; get next question or final output |
| POST | `/api/refine` | Refine the final output with follow-up comments |
| POST | `/api/tasks` | Generate implementation task breakdown from mega-prompt |
| GET | `/api/project/:id` | Retrieve current project state |
| GET | `/health` | Server health check |

### AI Response Shape

All AI responses conform to `AIResponse` (defined in `shared/types.ts`) with a `template` field that controls frontend rendering. The backend validates the AI's JSON output before returning it to the client. Key fields:
- `template` — determines which component renders
- `content` — template-specific data (question text, choices, mega_prompt, etc.)
- `auto_decisions[]` — `{decision, reason}` pairs the AI made autonomously
- `progress` — `{current, total}` for the progress bar
- `project_state_updates` — partial state to merge into the session

### Design System

The Aurora design system uses CSS custom properties defined in `client/src/index.css`:
- Theme tokens: `--color-bg`, `--color-surface`, `--color-primary` (#8B5CF6), `--color-secondary` (#F59E0B), etc.
- Component classes: `.aurora-card`, `.aurora-btn`, `.aurora-gradient-text`
- Glass effects: `--glass-bg`, `--glass-border`, backdrop-blur
- Typography: Clash Display (headings) + Inter (body)
- Both light and dark mode are fully supported via `.dark` class
