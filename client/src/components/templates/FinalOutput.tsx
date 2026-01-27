import React, { useState, useEffect } from 'react';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { GlassCard } from '../ui/GlassCard';
import { AgentTimeline } from '../ui/AgentTimeline';
import { motion } from 'framer-motion';
import {
    Copy, Check, RefreshCw, FileText, Code, BookOpen, Users,
    Sparkles, Layers, Database, Palette, ArrowRight, Rocket,
    CheckCircle2, Star
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
    content: UIContent;
    onRefine?: (comments: string) => void;
    onReset?: () => void;
}

export const FinalOutput: React.FC<Props> = ({ content, onRefine, onReset }) => {
    const [activeTab, setActiveTab] = useState<'spec' | 'prompt' | 'guides' | 'agents'>('spec');
    const [copied, setCopied] = useState(false);
    const [refineText, setRefineText] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const copyToClipboard = (text?: string) => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRefine = async () => {
        if (!onRefine || !refineText.trim()) return;
        setIsRefining(true);
        await onRefine(refineText);
        setIsRefining(false);
        setRefineText('');
    };

    const tabs = [
        { id: 'spec', label: 'Overview', icon: Layers },
        { id: 'prompt', label: 'Mega-Prompt', icon: Code },
        { id: 'agents', label: 'Build Team', icon: Users },
        { id: 'guides', label: 'Guides', icon: BookOpen },
    ] as const;

    // Stats for dashboard
    const featureCount = content.features_list?.length || 0;
    const techCount = content.tech_stack_recommendation?.length || 0;
    const guideCount = content.manual_guides?.length || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Success Header with Confetti Effect */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative text-center space-y-4 py-8"
            >
                {/* Confetti Animation */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    y: -20,
                                    x: Math.random() * 100 - 50 + '%',
                                    rotate: 0,
                                    scale: Math.random() * 0.5 + 0.5
                                }}
                                animate={{
                                    opacity: 0,
                                    y: 300,
                                    rotate: Math.random() * 360,
                                }}
                                transition={{
                                    duration: 2 + Math.random(),
                                    delay: Math.random() * 0.5,
                                    ease: 'easeOut'
                                }}
                                className={cn(
                                    "absolute w-3 h-3 rounded-sm",
                                    i % 3 === 0 ? "bg-cosmos-primary" :
                                        i % 3 === 1 ? "bg-cosmos-secondary" :
                                            "bg-green-400"
                                )}
                                style={{ left: `${Math.random() * 100}%` }}
                            />
                        ))}
                    </div>
                )}

                {/* Success Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400"
                >
                    <CheckCircle2 size={18} />
                    <span className="font-medium">Specification Complete!</span>
                </motion.div>

                {/* Project Name */}
                <h2 className="text-4xl md:text-5xl font-bold">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cosmos-primary via-cosmos-secondary to-green-400">
                        {content.project_name || "Your Project"}
                    </span>
                </h2>

                {/* Tagline */}
                <p className="text-xl text-cosmos-muted max-w-2xl mx-auto">
                    {content.app_tagline || "Ready for implementation"}
                </p>
            </motion.div>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="text-center py-4 group hover:border-cosmos-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('spec')}>
                    <Sparkles className="mx-auto mb-2 text-cosmos-primary group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-white">{featureCount}</div>
                    <div className="text-xs text-cosmos-muted">Features</div>
                </GlassCard>
                <GlassCard className="text-center py-4 group hover:border-cosmos-secondary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('spec')}>
                    <Layers className="mx-auto mb-2 text-cosmos-secondary group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-white">{techCount}</div>
                    <div className="text-xs text-cosmos-muted">Tech Stack</div>
                </GlassCard>
                <GlassCard className="text-center py-4 group hover:border-green-400/50 transition-colors cursor-pointer" onClick={() => setActiveTab('agents')}>
                    <Users className="mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-white">4</div>
                    <div className="text-xs text-cosmos-muted">Build Phases</div>
                </GlassCard>
                <GlassCard className="text-center py-4 group hover:border-amber-400/50 transition-colors cursor-pointer" onClick={() => setActiveTab('guides')}>
                    <BookOpen className="mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-white">{guideCount}</div>
                    <div className="text-xs text-cosmos-muted">Setup Guides</div>
                </GlassCard>
            </div>

            {/* Main Action: Copy Mega-Prompt */}
            <GlassCard className="bg-gradient-to-r from-cosmos-primary/10 to-cosmos-secondary/10 border-cosmos-primary/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-cosmos-primary/20 flex items-center justify-center">
                            <Rocket className="text-cosmos-primary" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Ready to Build?</h3>
                            <p className="text-sm text-cosmos-muted">Copy the mega-prompt and paste into your AI coding assistant</p>
                        </div>
                    </div>
                    <GlowingButton
                        onClick={() => copyToClipboard(content.mega_prompt)}
                        className="whitespace-nowrap"
                    >
                        {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                        {copied ? 'Copied!' : 'Copy Mega-Prompt'}
                    </GlowingButton>
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex border-b border-cosmos-border overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 font-medium transition-all relative whitespace-nowrap",
                            activeTab === tab.id
                                ? "text-cosmos-primary"
                                : "text-cosmos-muted hover:text-cosmos-text"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cosmos-primary"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'spec' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Features */}
                        <GlassCard>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-cosmos-primary" size={20} />
                                <h3 className="text-lg font-bold text-white">Core Features</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-2">
                                {content.features_list?.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <Star size={14} className="mt-1 text-cosmos-primary flex-shrink-0" />
                                        <span className="text-cosmos-text text-sm">{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Tech Stack */}
                        <GlassCard>
                            <div className="flex items-center gap-2 mb-4">
                                <Layers className="text-cosmos-secondary" size={20} />
                                <h3 className="text-lg font-bold text-white">Tech Stack</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {content.tech_stack_recommendation?.map((t, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-3 py-1.5 rounded-lg bg-cosmos-secondary/10 border border-cosmos-secondary/30 text-sm text-cosmos-secondary font-medium"
                                    >
                                        {t}
                                    </motion.span>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {activeTab === 'prompt' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative group"
                    >
                        <div className="bg-[#0B1120] p-6 rounded-xl border border-cosmos-border overflow-hidden">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {content.mega_prompt}
                            </pre>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GlowingButton onClick={() => copyToClipboard(content.mega_prompt)} className="text-xs px-4 py-2">
                                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </GlowingButton>
                        </div>
                        <p className="mt-4 text-center text-sm text-cosmos-muted">
                            Paste this prompt into <strong>Cursor</strong>, <strong>Windsurf</strong>, or any AI coding assistant.
                        </p>
                    </motion.div>
                )}

                {activeTab === 'agents' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {content.agents_md ? (
                            <AgentTimeline agentMd={content.agents_md} />
                        ) : (
                            <div className="text-center text-cosmos-muted py-10">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No build team plan generated.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'guides' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {content.manual_guides && content.manual_guides.length > 0 ? (
                            content.manual_guides.map((guide, i) => (
                                <GlassCard key={i}>
                                    <h3 className="text-lg font-bold text-cosmos-primary mb-3 flex items-center gap-2">
                                        <FileText size={18} />
                                        {guide.title}
                                    </h3>
                                    <ol className="space-y-2">
                                        {guide.steps.map((step, j) => (
                                            <li key={j} className="flex items-start gap-3 text-cosmos-muted">
                                                <span className="w-6 h-6 rounded-full bg-cosmos-primary/20 text-cosmos-primary text-sm flex items-center justify-center flex-shrink-0">
                                                    {j + 1}
                                                </span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </GlassCard>
                            ))
                        ) : (
                            <div className="text-center text-cosmos-muted py-10">
                                <CheckCircle2 size={48} className="mx-auto mb-4 text-green-400" />
                                <p className="font-medium text-white mb-1">No Manual Setup Required</p>
                                <p className="text-sm">This project can be built entirely with the mega-prompt!</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Refine Section */}
            <div className="pt-8 border-t border-cosmos-border space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <RefreshCw size={18} className="text-cosmos-primary" />
                    Need Changes?
                </h3>

                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <textarea
                            value={refineText}
                            onChange={(e) => setRefineText(e.target.value)}
                            placeholder="E.g. Add user profiles, change database to PostgreSQL, include dark mode..."
                            rows={2}
                            className="w-full bg-cosmos-bg/50 border border-cosmos-border rounded-lg p-4 text-white placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-primary transition-colors resize-none"
                        />
                        <div className="absolute bottom-3 right-3">
                            <GlowingButton
                                onClick={handleRefine}
                                disabled={isRefining || !refineText.trim()}
                                variant="secondary"
                                className="px-4 py-1 text-sm h-8"
                            >
                                {isRefining ? 'Updating...' : 'Refine Spec'}
                            </GlowingButton>
                        </div>
                    </div>

                    <button
                        onClick={onReset}
                        className="text-cosmos-muted hover:text-white text-sm flex items-center gap-1 transition-colors px-4 py-2 h-fit self-end"
                    >
                        New Project <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
