# Analysis Report & Refinement Plan

## 🚨 Key Findings (From Stress Test)

1. **Vague Opening Questions**: The AI often starts with "Let's understand the core problem..." or "Let's define the most important architectural decision...". This is low-value when the prompt is already "Dating app for rescue dogs".
   - *Fix*: Start immediately with detailed User or Workflow questions.

2. **Redundant Auth Questions**: Observed separate questions for "How should users log in?" and "Decide on authentication".
   - *Fix*: Consolidate into one "Identity & Access" question or auto-decide Auth if "Login" is discussed.

3. **Overly Educational/Chatty**: Questions use headers like "Understanding Where Your Data Lives..." which wastes tokens and user reading time.
   - *Fix*: Remove "Let's talk about..." preambles. Be direct.

4. **Category Drift**: "Hosting" (Deployment) asked at Q9 is okay, but "Architectural decision" at Q2 is too broad.
   - *Fix*: Enforce strict WHO -> WHAT -> HOW ordering.

## 🛠️ Refinement Plan for `prompts.ts`

### 1. Optimize First Turn
- If idea > 5 words, **SKIP** "What is the problem?"
- Jump straight to **Users** or **Core Features**.

### 2. Sharpen Question Templates
- **Banned Phrases**: "Let's talk about", "In this step", "Understanding X".
- **Direct Format**: "[Context] + [Question] + [Options]".

### 3. Improve Auto-Decisions
- If `user_accounts` is decided -> Auto-decide `authentication` (JWT/OAuth).
- If `data_model` is discussed -> Auto-decide `database` (PostgreSQL default unless specific).

### 4. Agent Selection Logic
- Ensure `agents_md` generation explicitly checks for mobile/AI keywords in the `idea` string, not just resolved decisions.
