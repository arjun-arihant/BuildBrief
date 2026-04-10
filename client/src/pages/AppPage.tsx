import { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, ChevronLeft, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { TemplateRenderer } from '../components/TemplateRenderer';
import { GlowingButton } from '../components/ui/GlowingButton';
import { Input } from '../components/ui/Input';
import { ThinkingIndicator } from '../components/ui/ThinkingIndicator';
import { usePersistedSession } from '../hooks/usePersistedSession';

const API_Base = '/api';
const MAX_RETRIES = 3;

interface ErrorState {
    message: string;
    retryFn: (() => void) | null;
    retryCount: number;
}

export function AppPage() {
    const navigate = useNavigate();
    const {
        ideaInput, setIdeaInput,
        loading, setLoading,
        state, updateState,
        resetApp,
        hasSavedSession, resumeSession, discardSession
    } = usePersistedSession();

    const [error, setErrorState] = useState<ErrorState | null>(null);
    const [existingContext, setExistingContext] = useState('');
    const [showExistingContext, setShowExistingContext] = useState(false);
    const retryCountRef = useRef(0);

    const setError = useCallback((message: string, retryFn?: () => void) => {
        setErrorState({
            message,
            retryFn: retryFn || null,
            retryCount: retryCountRef.current
        });
    }, []);

    const clearError = useCallback(() => {
        setErrorState(null);
        retryCountRef.current = 0;
    }, []);

    const handleRetry = useCallback(() => {
        if (error?.retryFn) {
            retryCountRef.current += 1;
            clearError();
            error.retryFn();
        }
    }, [error, clearError]);

    const startProject = async () => {
        if (!ideaInput.trim()) return;
        setLoading(true);
        clearError();

        const execute = async () => {
            const body: Record<string, string> = { idea: ideaInput };
            if (existingContext.trim()) {
                body.existingContext = existingContext.trim();
            }
            const res = await fetch(`${API_Base}/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.error || !data.success) throw new Error(data.error || 'Failed to initialize project');

            updateState({
                projectId: data.data.projectId,
                currentStep: data.data.step,
                history: [data.data.step]
            });
            retryCountRef.current = 0;
        };

        try {
            await execute();
        } catch (e: any) {
            const msg = e.message || "Failed to start";
            if (retryCountRef.current < MAX_RETRIES) {
                setError(msg, () => {
                    setLoading(true);
                    execute().catch((err: any) => {
                        setError(err.message || "Failed to start");
                    }).finally(() => setLoading(false));
                });
            } else {
                setError(`${msg} (tried ${MAX_RETRIES + 1} times)`);
            }
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (answer: string) => {
        if (!state.projectId) return;
        setLoading(true);
        clearError();

        const execute = async () => {
            const res = await fetch(`${API_Base}/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: state.projectId, answer })
            });
            const data = await res.json();
            if (data.error || !data.success) throw new Error(data.error || 'Failed to submit answer');

            updateState(prev => ({
                ...prev,
                currentStep: data.data.step,
                history: [...prev.history, data.data.step]
            }));
            retryCountRef.current = 0;
        };

        try {
            await execute();
        } catch (e: any) {
            const msg = e.message || "Failed to submit";
            if (retryCountRef.current < MAX_RETRIES) {
                setError(msg, () => {
                    setLoading(true);
                    execute().catch((err: any) => {
                        setError(err.message || "Failed to submit");
                    }).finally(() => setLoading(false));
                });
            } else {
                setError(`${msg} (tried ${MAX_RETRIES + 1} times)`);
            }
        } finally {
            setLoading(false);
        }
    };

    const refineAnswer = async (comments: string) => {
        if (!state.projectId) return;
        setLoading(true);
        clearError();

        const execute = async () => {
            const res = await fetch(`${API_Base}/refine`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: state.projectId, comments })
            });
            const data = await res.json();
            if (data.error || !data.success) throw new Error(data.error || 'Failed to refine');
            updateState(prev => ({
                ...prev,
                currentStep: data.data.step,
                history: [...prev.history, data.data.step]
            }));
            retryCountRef.current = 0;
        };

        try {
            await execute();
        } catch (e: any) {
            const msg = e.message || "Failed to refine";
            if (retryCountRef.current < MAX_RETRIES) {
                setError(msg, () => {
                    setLoading(true);
                    execute().catch((err: any) => {
                        setError(err.message || "Failed to refine");
                    }).finally(() => setLoading(false));
                });
            } else {
                setError(`${msg} (tried ${MAX_RETRIES + 1} times)`);
            }
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        if (state.history.length <= 1) return;
        updateState(prev => {
            const newHistory = prev.history.slice(0, -1);
            return {
                ...prev,
                currentStep: newHistory[newHistory.length - 1],
                history: newHistory
            };
        });
    };

    // Accumulate auto-decisions from all history steps, deduplicated
    const allAutoDecisions = useMemo(() => {
        const seen = new Set<string>();
        const decisions: Array<{ decision: string; reason: string }> = [];
        for (const step of state.history) {
            const stepDecisions = step.content?.auto_decisions;
            if (stepDecisions) {
                for (const d of stepDecisions) {
                    if (!seen.has(d.decision)) {
                        seen.add(d.decision);
                        decisions.push(d);
                    }
                }
            }
        }
        return decisions;
    }, [state.history]);

    const getProgressPercent = () => {
        if (state.currentStep?.progress) {
            return (state.currentStep.progress.current / state.currentStep.progress.total) * 100;
        }
        if (state.currentStep?.template === 'final_output') return 100;
        return Math.min(state.history.length * 12.5, 95);
    };

    const getProgressLabel = () => {
        if (state.currentStep?.progress) {
            return `Step ${state.currentStep.progress.current} of ~${state.currentStep.progress.total}`;
        }
        return `Step ${state.history.length}`;
    };

    const isFinalOutput = state.currentStep?.template === 'final_output';

    return (
        <div className="min-h-screen bg-aurora-bg text-aurora-text">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-72 h-72 bg-aurora-primary/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 right-20 w-96 h-96 bg-aurora-secondary/5 rounded-full blur-3xl"
                />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-aurora-bg/80 backdrop-blur-xl border-b border-aurora-border/30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aurora-primary to-aurora-secondary flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-display font-bold">BuildBrief</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {state.projectId && state.history.length > 1 && !isFinalOutput && (
                            <button
                                onClick={goBack}
                                className="flex items-center gap-2 text-sm text-aurora-muted hover:text-aurora-text transition-colors"
                            >
                                <ChevronLeft size={16} />
                                Back
                            </button>
                        )}
                        {state.projectId && (
                            <button
                                onClick={resetApp}
                                className="flex items-center gap-2 text-sm text-aurora-muted hover:text-aurora-text transition-colors"
                            >
                                <RotateCcw size={16} />
                                Start Over
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {!state.projectId ? (
                            <motion.div
                                key="landing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="min-h-[70vh] flex flex-col items-center justify-center text-center"
                            >
                                {/* Resume Session Card */}
                                {hasSavedSession ? (
                                    <div className="w-full max-w-lg">
                                        <GlassCard glow className="p-8">
                                            <div className="w-16 h-16 rounded-full bg-aurora-primary/20 flex items-center justify-center mx-auto mb-4">
                                                <Sparkles size={28} className="text-aurora-primary" />
                                            </div>
                                            <h2 className="text-2xl font-display font-bold mb-2">
                                                Welcome back!
                                            </h2>
                                            <p className="text-aurora-muted mb-6">
                                                You have an interview in progress{ideaInput ? ` for "${ideaInput.slice(0, 60)}${ideaInput.length > 60 ? '...' : ''}"` : ''}.
                                            </p>
                                            <div className="flex flex-col gap-3">
                                                <GlowingButton onClick={resumeSession} className="w-full">
                                                    Resume Session
                                                </GlowingButton>
                                                <GlowingButton onClick={discardSession} variant="secondary" className="w-full">
                                                    Start Fresh
                                                </GlowingButton>
                                            </div>
                                        </GlassCard>
                                    </div>
                                ) : (
                                    <>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                                                        bg-aurora-primary/10 border border-aurora-primary/30 mb-8">
                                            <Sparkles size={16} className="text-aurora-primary" />
                                            <span className="text-sm font-medium text-aurora-primary">AI Specification Engine</span>
                                        </div>

                                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                                            What's your{' '}
                                            <span className="aurora-gradient-text">idea</span>?
                                        </h1>

                                        <p className="text-xl text-aurora-muted max-w-xl mb-10">
                                            Describe your project and let our AI interview you to create a
                                            production-ready specification.
                                        </p>

                                        <div className="w-full max-w-2xl">
                                            <GlassCard glow className="p-3">
                                                <div className="flex gap-3 items-center">
                                                    <div className="flex-1 min-w-0">
                                                        <Input
                                                            value={ideaInput}
                                                            onChange={(e) => setIdeaInput(e.target.value)}
                                                            placeholder="e.g., A Tinder for adopting rescue dogs..."
                                                            className="border-none text-lg h-14 bg-transparent w-full"
                                                            onKeyDown={(e) => e.key === 'Enter' && startProject()}
                                                        />
                                                    </div>
                                                    <GlowingButton
                                                        onClick={startProject}
                                                        disabled={loading || !ideaInput.trim()}
                                                        className="h-14 px-6 flex-shrink-0"
                                                        icon={<ArrowRight size={20} />}
                                                        iconPosition="right"
                                                    >
                                                        Start
                                                    </GlowingButton>
                                                </div>
                                            </GlassCard>

                                            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm text-aurora-muted">
                                                <span>Need inspiration?</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setIdeaInput('A concierge booking app for boutique fitness classes.')}
                                                    className="text-aurora-primary hover:text-aurora-text transition-colors"
                                                >
                                                    Try a sample idea
                                                </button>
                                                <span className="text-aurora-border">|</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowExistingContext(!showExistingContext)}
                                                    className="text-aurora-primary hover:text-aurora-text transition-colors"
                                                >
                                                    {showExistingContext ? 'Hide' : 'I have an existing project'}
                                                </button>
                                            </div>

                                            {showExistingContext && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4"
                                                >
                                                    <GlassCard className="p-3">
                                                        <textarea
                                                            value={existingContext}
                                                            onChange={(e) => setExistingContext(e.target.value)}
                                                            placeholder="Describe your existing project — tech stack, current features, what you want to add..."
                                                            rows={4}
                                                            className="w-full bg-transparent border-none resize-none focus:outline-none text-aurora-text placeholder:text-aurora-muted/50 text-sm"
                                                        />
                                                    </GlassCard>
                                                    <p className="text-xs text-aurora-muted mt-2">
                                                        This helps the AI focus on extensions rather than rebuilding from scratch.
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl">
                                            {[
                                                { label: 'AI Interview', desc: 'Intelligent questions' },
                                                { label: 'Smart Decisions', desc: 'Auto-selects tech' },
                                                { label: 'Mega-Prompt', desc: 'Ready for AI agents' },
                                            ].map((item) => (
                                                <div key={item.label} className="text-center">
                                                    <div className="text-aurora-text font-medium">{item.label}</div>
                                                    <div className="text-sm text-aurora-muted">{item.desc}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-10 grid gap-3 text-left max-w-2xl">
                                            {[
                                                { title: 'Step 1', desc: 'Share your idea and goal.' },
                                                { title: 'Step 2', desc: 'Answer focused architecture questions.' },
                                                { title: 'Step 3', desc: 'Get a copy-ready Mega-Prompt.' }
                                            ].map((item) => (
                                                <div key={item.title} className="flex items-center gap-4 text-aurora-muted">
                                                    <div className="w-14 text-aurora-text font-medium">{item.title}</div>
                                                    <div className="flex-1 h-px bg-aurora-border/40" />
                                                    <div className="text-sm">{item.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="wizard"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-8"
                            >
                                {/* Progress */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-aurora-muted">Progress</span>
                                        <span className="text-sm text-aurora-muted">
                                            {getProgressLabel()}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-aurora-surface rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-aurora-primary to-aurora-secondary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getProgressPercent()}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                {/* Step Content */}
                                <AnimatePresence mode="wait">
                                    {state.currentStep && (
                                        <TemplateRenderer
                                            step={state.currentStep}
                                            onSubmit={submitAnswer}
                                            onRefine={refineAnswer}
                                            onReset={resetApp}
                                            loading={loading}
                                            allDecisions={allAutoDecisions}
                                            projectId={state.projectId || undefined}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Thinking Indicator — shown below step content during loading */}
                                {loading && state.currentStep && (
                                    <ThinkingIndicator />
                                )}

                                {/* Error with Retry */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6"
                                    >
                                        <GlassCard className="border-aurora-error/30 bg-aurora-error/5 p-4">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-aurora-error font-medium">{error.message}</p>
                                                    {error.retryFn && error.retryCount < MAX_RETRIES && (
                                                        <p className="text-aurora-muted text-sm mt-1">
                                                            Attempt {error.retryCount + 1} of {MAX_RETRIES + 1}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    {error.retryFn && error.retryCount < MAX_RETRIES && (
                                                        <GlowingButton
                                                            onClick={handleRetry}
                                                            variant="secondary"
                                                            size="sm"
                                                            icon={<RefreshCw size={14} />}
                                                        >
                                                            Try Again
                                                        </GlowingButton>
                                                    )}
                                                    <GlowingButton
                                                        onClick={resetApp}
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        Start Over
                                                    </GlowingButton>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Thinking Indicator — centered when loading with no step */}
            {loading && !state.currentStep && (
                <div className="fixed inset-0 flex items-center justify-center z-40">
                    <ThinkingIndicator />
                </div>
            )}

            {/* Error on landing page */}
            {error && !state.projectId && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
                    <GlassCard className="border-aurora-error/30 bg-aurora-error/5 p-4">
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-aurora-error font-medium">{error.message}</p>
                            <div className="flex gap-2">
                                {error.retryFn && error.retryCount < MAX_RETRIES && (
                                    <GlowingButton onClick={handleRetry} variant="secondary" size="sm">
                                        Try Again
                                    </GlowingButton>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
