import { ProjectState } from './types';
import { randomUUID } from 'crypto';

export class StateManager {
    private stores: Map<string, ProjectState> = new Map();

    createSession(initialIdea: string): string {
        const id = randomUUID();
        const initialState: ProjectState = {
            idea_summary: initialIdea,
            target_user: null,
            problem_statement: null,
            app_type: null,
            resolved_decisions: {},
            unresolved_decisions: [],
            manual_prerequisites: [],
            assumptions: [],
            history: [],
            is_complete: false
        };
        this.stores.set(id, initialState);
        return id;
    }

    getSession(id: string): ProjectState | undefined {
        return this.stores.get(id);
    }

    updateSession(id: string, updates: Partial<ProjectState>): ProjectState {
        const current = this.stores.get(id);
        if (!current) throw new Error('Session not found');

        const newState = { ...current, ...updates };
        // Deep merge would be better for arrays/objects but superficial merge is ok for now if we replace arrays
        // Actually, let's be careful. if updates has history, it replaces history.
        // The AI will send the *delta* or we handle appending.
        // For this simple app, we will let the "logic" layer handle appending history, and here we just set.

        this.stores.set(id, newState);
        return newState;
    }
}

export const stateManager = new StateManager();
