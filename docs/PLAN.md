# Orchestration Plan: AI Prompt Analysis & Refinement

## Context
The user wants to evaluate the AI's performance by running 20 diverse project ideas through the system. The goal is to analyze the questions asking strategy, option generation, Agent selection, and Integration Guides, then refine the system based on findings.

## Phase 1: Planning (Current)
- [x] Define 20 diverse test prompts
- [x] Define Agent Roles
- [x] Create this PLAN.md

## Phase 2: Data Collection (Agent: `test-engineer`)
- [ ] Create `server/scripts/run_prompt_analysis.ts`
  - List of 20 prompts
  - Loop configuration (Init -> Loop Answer -> Final Output)
  - Auto-answer strategy (select Option 0 for consistency, or random?) -> *Standardized on Option 0 to test specific happy paths, or random for variety? Let's use Option 0 to verify the logical "next step" flow.*
  - Logging to `server/data/analysis_results.json`
- [ ] Execute script against running localhost backend

## Phase 3: Analysis (Agent: `ai-ml-engineer`)
- [ ] Analyze `analysis_results.json` for:
  - **Question Impact**: Are questions repetitive? Do they honor the dynamic limit?
  - **Agent Selection**: Are "mobile-developer" or "ai-ml-engineer" selected appropriately?
  - **Integration Guides**: Are they specific or generic?
  - **Inference**: Did the inference engine correctly skip basic questions?

## Phase 4: Refinement (Agent: `backend-specialist`)
- [ ] Refine `server/src/prompts.ts`
  - Adjust inference logic
  - Tune question categories/weights
  - Improve Agent selection prompts
- [ ] Refine `server/src/agents_context.ts` if needed

## Test Prompts List
1. E-commerce for vintage shoes
2. Dating app for rescue dogs
3. AI-powered code editor
4. Fitness tracker with social component
5. Crypto wallet & portfolio tracker
6. Recipe sharing community
7. Uber for lawn mowing services
8. ADHD-friendly task manager
9. VR Language learning app
10. Second-hand car marketplace
11. Telemedicine platform for rural areas
12. Student budgeting app
13. Warehouse inventory management system
14. Wedding planning assistant
15. Real estate listing platform
16. Browser-based podcast recorder
17. NFT gallery and marketplace
18. Meditation app with biofeedback integration
19. Local artisan marketplace
20. Corporate travel booking SaaS

## Execution Team
- **test-engineer**: Scripting & Data Generation
- **ai-ml-engineer**: Pattern Recognition & Quality Assurance
- **backend-specialist**: Implementation of Fixes
