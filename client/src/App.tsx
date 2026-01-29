import { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { GlassCard } from './components/ui/GlassCard';
import { GlowingButton } from './components/ui/GlowingButton';
import { Input } from './components/ui/Input';
import { TemplateRenderer } from './components/TemplateRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Rocket, Activity, ArrowRight } from 'lucide-react';
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
            {/* Decorative floating orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-72 h-72 bg-aurora-primary/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 right-20 w-96 h-96 bg-aurora-secondary/8 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 left-1/3 w-64 h-64 bg-aurora-accent/8 rounded-full blur-3xl"
                />
            </div>

            <AnimatePresence mode="wait">
                {!projectId ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center text-center space-y-8 mt-10 relative z-10"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aurora-primary/10 border border-aurora-primary/30 text-aurora-primary mb-2"
                        >
                            <Sparkles size={16} />
                            <span className="text-sm font-medium">AI-Powered Specification Engine</span>
                        </motion.div>

                        {/* Hero Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-4"
                        >
                            From <span className="aurora-gradient-text">Idea</span> to{' '}
                            <span className="text-aurora-primary">Spec</span>.
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-aurora-muted max-w-2xl mx-auto leading-relaxed mb-8"
                        >
                            BuildBrief helps you define your next big thing. It acts as a Senior PM,
                            interviewing you to generate a production-ready Mega-Prompt for AI coding agents.
                        </motion.p>

                        {/* Input Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="w-full max-w-2xl"
                        >
                            <GlassCard className="p-2 flex gap-2 items-center" glow>
                                <Input
                                    value={ideaInput}
                                    onChange={(e) => setIdeaInput(e.target.value)}
                                    placeholder="e.g. A Tinder for adopting rescue dogs..."
                                    className="border-none text-lg h-14 bg-transparent"
                                    containerClassName="flex-1 min-w-0"
                                    onKeyDown={(e) => e.key === 'Enter' && startProject()}
                                />
                                <GlowingButton
                                    onClick={startProject}
                                    disabled={loading}
                                    className="h-14 px-8"
                                    icon={loading ? <Activity className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                                    iconPosition="right"
                                >
                                    {loading ? 'Analyzing...' : 'Start Building'}
                                </GlowingButton>
                            </GlassCard>
                        </motion.div>

                        {error && <p className="text-aurora-error">{error}</p>}

                        {/* Feature Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-16"
                        >
                            {[
                                {
                                    icon: Brain,
                                    title: "Intelligent Inquiry",
                                    desc: "Adaptive questions that clarify your vision and catch edge cases.",
                                    color: "text-aurora-primary"
                                },
                                {
                                    icon: Rocket,
                                    title: "Mega-Prompt Output",
                                    desc: "Copy-paste specifications ready for Cursor, Windsurf, or Bolt.",
                                    color: "text-aurora-secondary"
                                },
                                {
                                    icon: Sparkles,
                                    title: "Smart Decisions",
                                    desc: "Auto-decides technical details so you focus on what matters.",
                                    color: "text-aurora-accent"
                                }
                            ].map((feature, i) => (
                                <GlassCard key={i} hover className="text-left">
                                    <feature.icon className={`${feature.color} mb-4`} size={28} />
                                    <h3 className="text-lg font-semibold mb-2 text-aurora-text">{feature.title}</h3>
                                    <p className="text-aurora-muted text-sm leading-relaxed">{feature.desc}</p>
                                </GlassCard>
                            ))}
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="wizard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10"
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
