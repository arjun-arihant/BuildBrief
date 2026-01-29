import { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { GlassCard } from './components/ui/GlassCard';
import { GlowingButton } from './components/ui/GlowingButton';
import { Input } from './components/ui/Input';
import { TemplateRenderer } from './components/TemplateRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Rocket, Activity } from 'lucide-react';
import type { AIResponse } from './types';

const API_Base = '/api';

function App() {
    // State
    const [projectId, setProjectId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<AIResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [ideaInput, setIdeaInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    // API Methods
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
            setError(e.message || "Failed to submit");
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

    const resetApp = () => window.location.reload();

    return (
        <Shell>
            <AnimatePresence mode="wait">
                {!projectId ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center text-center space-y-8 mt-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cosmos-primary/10 border border-cosmos-primary/20 text-cosmos-primary mb-2">
                            <Sparkles size={16} />
                            <span className="text-sm font-medium">AI-Powered Architecture</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
                            From <span className="text-cosmos-secondary">Idea</span> to <span className="text-cosmos-primary">Spec</span>.
                        </h1>
                        <p className="text-xl text-cosmos-muted max-w-2xl mx-auto leading-relaxed mb-8">
                            BuildBrief helps you define your next big thing. It acts as a Senior PM, interviewing you to generate a production-ready Mega-Prompt.
                        </p>

                        {/* Input Section */}
                        <GlassCard className="w-full max-w-2xl p-2 flex gap-2 items-center">
                            <Input
                                value={ideaInput}
                                onChange={(e) => setIdeaInput(e.target.value)}
                                placeholder="e.g. A Tinder for adopting rescue dogs..."
                                className="border-none text-lg h-14"
                                containerClassName="flex-1 min-w-0" // Allow flex grow and prevent overflow
                                onKeyDown={(e) => e.key === 'Enter' && startProject()}
                            />
                            <GlowingButton onClick={startProject} disabled={loading} className="h-14 px-8 whitespace-nowrap">
                                {loading ? <Activity className="animate-spin" /> : <Rocket className="mr-2" size={20} />}
                                {loading ? 'Building...' : 'Start'}
                            </GlowingButton>
                        </GlassCard>

                        {error && <p className="text-red-400">{error}</p>}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-16">
                            {[
                                { icon: Brain, title: "Intelligent Inquiry", desc: "Adaptive questions that clarify your vision." },
                                { icon: Rocket, title: "Mega-Prompt Output", desc: "Copy-paste specs for Cursor or Windsurf." },
                                { icon: Sparkles, title: "Design Systems", desc: "Auto-suggested UI themes and stacks." }
                            ].map((feature, i) => (
                                <GlassCard key={i} hoverEffect className="text-left">
                                    <feature.icon className="text-cosmos-primary mb-4" size={32} />
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-cosmos-muted text-sm">{feature.desc}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="wizard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {currentStep && (
                            <TemplateRenderer
                                step={currentStep}
                                onSubmit={submitAnswer}
                                onRefine={refineProject}
                                onReset={resetApp}
                                loading={loading}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </Shell>
    );
}

export default App;
