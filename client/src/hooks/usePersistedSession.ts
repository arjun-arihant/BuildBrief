import { useState, useEffect, useCallback } from 'react';
import type { AIResponse } from '../types';

const STORAGE_KEY = 'buildbrief_active_session';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

interface PersistedSession {
    projectId: string | null;
    currentStep: AIResponse | null;
    history: AIResponse[];
    ideaInput: string;
    savedAt: number;
}

interface ProjectState {
    projectId: string | null;
    currentStep: AIResponse | null;
    history: AIResponse[];
}

function loadSession(): PersistedSession | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as PersistedSession;
        if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return parsed;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function saveSession(session: PersistedSession): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
        // Storage full or blocked — fail silently
    }
}

function clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export function usePersistedSession() {
    const [ideaInput, setIdeaInputState] = useState('');
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<ProjectState>({
        projectId: null,
        currentStep: null,
        history: []
    });
    const [hasSavedSession, setHasSavedSession] = useState(false);

    // Load saved session on mount
    useEffect(() => {
        const saved = loadSession();
        if (saved && saved.projectId) {
            setHasSavedSession(true);
            setIdeaInputState(saved.ideaInput || '');
            setState({
                projectId: saved.projectId,
                currentStep: saved.currentStep,
                history: saved.history
            });
        }
    }, []);

    // Persist on every state change
    useEffect(() => {
        if (state.projectId) {
            saveSession({
                projectId: state.projectId,
                currentStep: state.currentStep,
                history: state.history,
                ideaInput,
                savedAt: Date.now()
            });
        }
    }, [state, ideaInput]);

    const setIdeaInput = useCallback((value: string) => {
        setIdeaInputState(value);
    }, []);

    const updateState = useCallback((updater: ProjectState | ((prev: ProjectState) => ProjectState)) => {
        setState(updater);
    }, []);

    const resetApp = useCallback(() => {
        setState({ projectId: null, currentStep: null, history: [] });
        setIdeaInputState('');
        setHasSavedSession(false);
        clearSession();
    }, []);

    const resumeSession = useCallback(() => {
        setHasSavedSession(false);
    }, []);

    const discardSession = useCallback(() => {
        resetApp();
    }, [resetApp]);

    return {
        ideaInput,
        setIdeaInput,
        loading,
        setLoading,
        state,
        updateState,
        resetApp,
        hasSavedSession,
        resumeSession,
        discardSession
    };
}
