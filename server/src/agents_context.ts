export const AGENTS_CONTEXT = `
═══════════════════════════════════════════════════════════════
AVAILABLE AGENTS FOR ORCHESTRATION
═══════════════════════════════════════════════════════════════

Select agents based on the PROJECT TYPE and REQUIREMENTS.
Each agent has a specific focus — use the right one for the job.

───────────────────────────────────────────────────────────────
PLANNING & COORDINATION
───────────────────────────────────────────────────────────────

1. project-planner
   Focus: Task breakdown, epic/story creation, dependency graphs, timeline estimation
   Use for: NEW PROJECTS, MAJOR FEATURES, COMPLEX REFACTORS
   Output: PLAN.md with phases, milestones, and file structure

───────────────────────────────────────────────────────────────
FRONTEND & UI/UX
───────────────────────────────────────────────────────────────

2. frontend-specialist
   Focus: React, Next.js, Vue, Tailwind, Component architecture, State management
   Use for: WEB APPS, SPAs, UI COMPONENTS, RESPONSIVE DESIGN
   Skills: Modern CSS, Accessibility, Performance optimization

3. mobile-developer
   Focus: React Native, Flutter, Expo, Native APIs, Mobile UX patterns
   Use for: MOBILE APPS (iOS/Android), Cross-platform development
   Skills: Touch interactions, Offline-first, Push notifications

───────────────────────────────────────────────────────────────
BACKEND & DATA
───────────────────────────────────────────────────────────────

4. backend-specialist
   Focus: Node.js, Python, APIs (REST/GraphQL), Database design, Authentication
   Use for: SERVER LOGIC, API ENDPOINTS, DATA PROCESSING
   Skills: Express, FastAPI, Prisma, TypeORM, JWT, OAuth

5. database-architect
   Focus: Schema design, Indexing, Query optimization, Data modeling
   Use for: DATABASE SETUP, MIGRATIONS, PERFORMANCE TUNING
   Skills: PostgreSQL, MongoDB, Redis, Supabase, PlanetScale

───────────────────────────────────────────────────────────────
INFRASTRUCTURE & DEPLOYMENT
───────────────────────────────────────────────────────────────

6. devops-engineer
   Focus: CI/CD, Docker, Kubernetes, Cloud deployment, Monitoring
   Use for: PRODUCTION DEPLOYMENT, INFRASTRUCTURE SETUP
   Skills: GitHub Actions, Vercel, AWS, GCP, Terraform

───────────────────────────────────────────────────────────────
QUALITY & SECURITY
───────────────────────────────────────────────────────────────

7. test-engineer
   Focus: Testing strategies, TDD, E2E testing, Test automation
   Use for: QUALITY ASSURANCE, TEST SUITE SETUP
   Skills: Jest, Vitest, Playwright, Cypress, Testing Library

8. security-auditor
   Focus: Vulnerability scanning, Auth/Authz, OWASP compliance
   Use for: SECURITY REVIEW, PENETRATION TESTING
   Skills: Input validation, XSS/CSRF prevention, Secret management

───────────────────────────────────────────────────────────────
SPECIALIZED
───────────────────────────────────────────────────────────────

9. performance-engineer
   Focus: Load testing, Bundle optimization, Core Web Vitals
   Use for: PERFORMANCE OPTIMIZATION, SCALING
   Skills: Lighthouse, Webpack analysis, Lazy loading, Caching

10. ai-ml-engineer
    Focus: LLM integration, Vector databases, AI/ML pipelines
    Use for: AI FEATURES, CHATBOTS, RECOMMENDATIONS
    Skills: OpenAI, LangChain, Pinecone, RAG patterns

11. documentation-writer
    Focus: READMEs, API docs, Code comments, User guides
    Use for: DOCUMENTATION, ONBOARDING MATERIALS
    Skills: JSDoc, OpenAPI/Swagger, Markdown, Docusaurus

═══════════════════════════════════════════════════════════════
PROJECT TYPE → RECOMMENDED TEAM
═══════════════════════════════════════════════════════════════

WEB APP (SaaS, Dashboard, E-commerce):
  → project-planner + frontend-specialist + backend-specialist + test-engineer

MOBILE APP:
  → project-planner + mobile-developer + backend-specialist + test-engineer

API SERVICE:
  → project-planner + backend-specialist + database-architect + security-auditor

AI-POWERED APP:
  → project-planner + ai-ml-engineer + backend-specialist + frontend-specialist

LANDING PAGE / MARKETING:
  → frontend-specialist + performance-engineer + documentation-writer

═══════════════════════════════════════════════════════════════
ORCHESTRATION WORKFLOW
═══════════════════════════════════════════════════════════════

Phase 1 (Foundation): project-planner creates structure
Phase 2 (Core): frontend + backend build in parallel
Phase 3 (Quality): test-engineer + security-auditor verify
Phase 4 (Deploy): devops-engineer deploys to production
Phase 5 (Docs): documentation-writer creates user guides
`;
