import { useState } from 'react';
import { TemplateRenderer } from './components/TemplateRenderer';
import { AIResponse } from './types';
import { Star } from 'lucide-react'; // Import Star
import './index.css';

const API_Base = '/api'; // Vite proxy handles the rest

function App() {
    const [projectId, setProjectId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<AIResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [ideaInput, setIdeaInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const startProject = async () => {
        if (!ideaInput.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_Base}/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea: ideaInput })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setProjectId(data.projectId);
            setCurrentStep(data.step);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to start");
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (answer: string) => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_Base}/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, answer })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setCurrentStep(data.step);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to submit answer");
        } finally {
            setLoading(false);
        }
    };

    const refineProject = async (comments: string) => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_Base}/refine`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, comments })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setCurrentStep(data.step);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to refine");
        } finally {
            setLoading(false);
        }
    };

    // Reload for "Build Another"
    const resetApp = () => {
        window.location.reload();
    };

    return (
        <div className="app-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                    BuildBrief
                </h1>
                <p style={{ color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                    From Vague Idea to Production Spec
                </p>
            </header>

            <main className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', minHeight: '400px', position: 'relative' }}>
                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fee2e2', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                        Error: {error}
                    </div>
                )}

                {!projectId ? (
                    <div className="fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>What do you want to build?</h2>
                        <textarea
                            value={ideaInput}
                            onChange={(e) => setIdeaInput(e.target.value)}
                            placeholder="e.g. A Tinder for adopting rescue dogs..."
                            rows={6}
                            style={{ marginBottom: '1.5rem', width: '100%' }}
                        />
                        <button
                            className="btn-primary"
                            onClick={startProject}
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Analyzing...' : 'Start Building Definition'}
                        </button>
                    </div>
                ) : (
                    <div className="fade-in">
                        {/* Progress Bar */}
                        {currentStep && currentStep.progress && (
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                                {Array.from({ length: currentStep.progress.total }).map((_, i) => {
                                    const isCurrent = i === (currentStep.progress!.current - 1);
                                    const isPast = i < (currentStep.progress!.current - 1);
                                    const isEducational = isCurrent && currentStep.is_educational;

                                    if (isEducational) {
                                        return (
                                            <div key={i} style={{ color: '#fbbf24', transform: 'scale(1.2)' }}>
                                                <Star size={16} fill="currentColor" />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: (isCurrent || isPast)
                                                    ? 'var(--color-primary)'
                                                    : 'rgba(255,255,255,0.1)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {currentStep && (
                            <TemplateRenderer
                                step={currentStep}
                                onSubmit={submitAnswer}
                                onRefine={refineProject}
                                onReset={resetApp}
                                loading={loading}
                            />
                        )}
                    </div>
                )}

                {loading && projectId && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Thinking...</p>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}

export default App;
