import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { stateManager } from './state';
import { getNextStep } from './openrouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('BuildBrief API Server is running! 🚀<br>Please access the application via the Client at http://localhost:5173');
});

// Init Endpoint
app.post('/api/init', async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) {
            return res.status(400).json({ error: 'Idea is required' });
        }

        // 1. Create Session
        const projectId = stateManager.createSession(idea);
        const currentState = stateManager.getSession(projectId);

        if (!currentState) {
            throw new Error("Failed to create session");
        }

        // 2. Get First Question from AI (NO QUEUE)
        const firstStep = await getNextStep(currentState, `My idea is: ${idea}`);

        // 3. Update State with AI's deductions
        const updates: any = {
            ...(firstStep.project_state_updates || {}),
            history: [...currentState.history, { question: "INITIAL_IDEA", answer: idea }]
        };

        stateManager.updateSession(projectId, updates);

        // Progress is simple now: 1
        firstStep.progress = { current: 1, total: 10 };

        res.json({ projectId, step: firstStep });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Answer Endpoint
app.post('/api/answer', async (req, res) => {
    try {
        const { projectId, answer } = req.body;
        if (!projectId || !answer) {
            return res.status(400).json({ error: 'Missing projectId or answer' });
        }

        const currentState = stateManager.getSession(projectId);
        if (!currentState) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // 1. Record User Answer in History
        const updatedHistory = [...currentState.history, { question: "AI_QUESTION", answer: answer }];
        stateManager.updateSession(projectId, { history: updatedHistory });

        // 2. Ask Gemini (NO QUEUE)
        console.log("Asking Gemini...");
        const stateWithHistory = stateManager.getSession(projectId)!; // Refresh state
        const nextStep = await getNextStep(stateWithHistory, answer);

        // 3. Update Project Data State (if the step contains updates)
        if (nextStep.project_state_updates) {
            stateManager.updateSession(projectId, nextStep.project_state_updates);
        }

        // 4. Force correct progress calculation
        // History length includes the question we just answered.
        // So the NEXT question is length + 1.
        const finalHistory = stateManager.getSession(projectId)?.history || [];
        nextStep.progress = {
            current: finalHistory.length + 1,
            total: 10
        };

        res.json({ step: nextStep });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Refine Endpoint
app.post('/api/refine', async (req, res) => {
    try {
        const { projectId, comments } = req.body;
        if (!projectId || !comments) {
            return res.status(400).json({ error: 'Missing projectId or comments' });
        }

        const currentState = stateManager.getSession(projectId);
        if (!currentState) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Logic: Send the entire state + comments to Gemini to regenerate "final_output"
        // We reuse getNextStep but with a specific prefix
        const stateWithRefinement = {
            ...currentState,
            history: [...currentState.history, { question: "USER_REFINEMENT", answer: comments }]
        };

        const nextStep = await getNextStep(stateWithRefinement, "GENERATE_REFINED_OUTPUT");

        // Update state
        stateManager.updateSession(projectId, {
            history: stateWithRefinement.history
        });

        res.json({ step: nextStep });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/project/:id', (req, res) => {
    const state = stateManager.getSession(req.params.id);
    if (!state) return res.status(404).json({ error: "Not found" });
    res.json(state);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
