import React, { useState, useEffect } from 'react';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { GlassCard } from '../ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Copy, Check, RefreshCw, Code, BookOpen, ListChecks,
    Sparkles, Layers, ArrowRight, Rocket, CheckCircle2, Star,
    Download, ChevronDown, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatForCursor, formatForWindsurf, formatForBolt, downloadAsFile } from '../../lib/exportFormats';

interface TaskItem {
    id: number;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimated_hours: number;
    dependencies: number[];
}

interface TaskPhase {
    name: string;
    tasks: TaskItem[];
}

interface TaskBreakdownResult {
    project_name: string;
    total_estimated_hours: number;
    phases: TaskPhase[];
}

interface Props {
    content: UIContent;
    onRefine?: (comments: string) => void;
    onReset?: () => void;
    loading?: boolean;
    projectId?: string;
}

export const FinalOutput: React.FC<Props> = ({ content, onRefine, onReset, loading, projectId }) => {
    const [activeTab, setActiveTab] = useState<'spec' | 'prompt' | 'guides' | 'agents'>('spec');
    const [copied, setCopied] = useState(false);
    const [refineText, setRefineText] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [taskBreakdown, setTaskBreakdown] = useState<TaskBreakdownResult | null>(null);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

    const projectName = content.project_name || 'project';
    const megaPrompt = content.mega_prompt || '';

    const totalTasks = taskBreakdown?.phases?.reduce((acc, p) => acc + p.tasks.length, 0) || 0;

    const toggleTaskDone = (taskId: number) => {
        setCompletedTasks(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) next.delete(taskId);
            else next.add(taskId);
            return next;
        });
    };

    const handleTaskBreakdown = async () => {
        if (!megaPrompt || !projectId) return;
        setIsLoadingTasks(true);
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, megaPrompt, projectName })
            });
            const data = await res.json();
            if (data.success && data.data?.tasks) {
                setTaskBreakdown(data.data.tasks as TaskBreakdownResult);
            }
        } catch (err) {
            console.error('Task breakdown failed:', err);
        } finally {
            setIsLoadingTasks(false);
        }
    };

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
        { id: 'agents', label: "What's Next", icon: ListChecks },
        { id: 'guides', label: 'Setup Guides', icon: BookOpen },
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
                                    i % 3 === 0 ? "bg-aurora-primary" :
                                        i % 3 === 1 ? "bg-aurora-secondary" :
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
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-aurora-primary via-aurora-secondary to-green-400">
                        {content.project_name || "Your Project"}
                    </span>
                </h2>

                {/* Tagline */}
                <p className="text-xl text-aurora-muted max-w-2xl mx-auto">
                    {content.app_tagline || "Ready for implementation"}
                </p>
            </motion.div>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="text-center py-4 group hover:border-aurora-primary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('spec')}>
                    <Sparkles className="mx-auto mb-2 text-aurora-primary group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-aurora-text">{featureCount}</div>
                    <div className="text-xs text-aurora-muted">Features</div>
                </GlassCard>
                <GlassCard className="text-center py-4 group hover:border-aurora-secondary/50 transition-colors cursor-pointer" onClick={() => setActiveTab('spec')}>
                    <Layers className="mx-auto mb-2 text-aurora-secondary group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-aurora-text">{techCount}</div>
                    <div className="text-xs text-aurora-muted">Tech Stack</div>
                </GlassCard>
                <GlassCard className="text-center py-4 group hover:border-green-400/50 transition-colors cursor-pointer" onClick={() => setActiveTab('agents')}>
                    <ListChecks className="mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-aurora-text">4</div>
                    <div className="text-xs text-aurora-muted">Next Steps</div>
                </GlassCard>
                <GlassCard className="text-center py-4 group hover:border-amber-400/50 transition-colors cursor-pointer" onClick={() => setActiveTab('guides')}>
                    <BookOpen className="mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-2xl font-bold text-aurora-text">{guideCount}</div>
                    <div className="text-xs text-aurora-muted">Setup Guides</div>
                </GlassCard>
            </div>

            {/* Main Action: Export Mega-Prompt */}
            <GlassCard className="bg-gradient-to-r from-aurora-primary/10 to-aurora-secondary/10 border-aurora-primary/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-aurora-primary/20 flex items-center justify-center">
                            <Rocket className="text-aurora-primary" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-aurora-text">Ready to Build?</h3>
                            <p className="text-sm text-aurora-muted">Export for your preferred AI coding tool</p>
                        </div>
                    </div>
                    <div className="relative">
                        <GlowingButton
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="whitespace-nowrap"
                        >
                            {copied ? <Check size={18} /> : <Download size={18} />}
                            {copied ? 'Copied!' : 'Export'}
                            <ChevronDown size={16} className={cn("transition-transform", showExportMenu && "rotate-180")} />
                        </GlowingButton>

                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-aurora-surface/95 backdrop-blur-xl border border-aurora-border rounded-xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="p-1">
                                        <button
                                            onClick={() => { copyToClipboard(formatForCursor(megaPrompt, projectName)); setShowExportMenu(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-aurora-surfaceHover/50 rounded-lg transition-colors"
                                        >
                                            <Code size={16} className="text-aurora-primary" />
                                            <div>
                                                <div className="font-medium text-aurora-text">Copy for Cursor</div>
                                                <div className="text-xs text-aurora-muted">.cursorrules format</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => { copyToClipboard(formatForWindsurf(megaPrompt, projectName)); setShowExportMenu(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-aurora-surfaceHover/50 rounded-lg transition-colors"
                                        >
                                            <Sparkles size={16} className="text-aurora-secondary" />
                                            <div>
                                                <div className="font-medium text-aurora-text">Copy for Windsurf</div>
                                                <div className="text-xs text-aurora-muted">.windsurfrules format</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => { copyToClipboard(formatForBolt(megaPrompt)); setShowExportMenu(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-aurora-surfaceHover/50 rounded-lg transition-colors"
                                        >
                                            <Zap size={16} className="text-amber-400" />
                                            <div>
                                                <div className="font-medium text-aurora-text">Copy for Bolt</div>
                                                <div className="text-xs text-aurora-muted">Plain text format</div>
                                            </div>
                                        </button>
                                        <div className="border-t border-aurora-border/30 my-1" />
                                        <button
                                            onClick={() => { downloadAsFile(formatForCursor(megaPrompt, projectName), '.cursorrules'); setShowExportMenu(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-aurora-surfaceHover/50 rounded-lg transition-colors"
                                        >
                                            <Download size={16} className="text-aurora-muted" />
                                            <div>
                                                <div className="font-medium text-aurora-text">Download .cursorrules</div>
                                                <div className="text-xs text-aurora-muted">Cursor rules file</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => { downloadAsFile(megaPrompt, `${projectName}-mega-prompt.md`); setShowExportMenu(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-aurora-surfaceHover/50 rounded-lg transition-colors"
                                        >
                                            <Download size={16} className="text-aurora-muted" />
                                            <div>
                                                <div className="font-medium text-aurora-text">Download .md</div>
                                                <div className="text-xs text-aurora-muted">Markdown file</div>
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex border-b border-aurora-border overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 font-medium transition-all relative whitespace-nowrap",
                            activeTab === tab.id
                                ? "text-aurora-primary"
                                : "text-aurora-muted hover:text-aurora-text"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-aurora-primary"
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
                                <Sparkles className="text-aurora-primary" size={20} />
                                <h3 className="text-lg font-bold text-aurora-text">Core Features</h3>
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
                                        <Star size={14} className="mt-1 text-aurora-primary flex-shrink-0" />
                                        <span className="text-aurora-text text-sm">{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Tech Stack */}
                        <GlassCard>
                            <div className="flex items-center gap-2 mb-4">
                                <Layers className="text-aurora-secondary" size={20} />
                                <h3 className="text-lg font-bold text-aurora-text">Tech Stack</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {content.tech_stack_recommendation?.map((t, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-3 py-1.5 rounded-lg bg-aurora-secondary/10 border border-aurora-secondary/30 text-sm text-aurora-secondary font-medium"
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
                        <div className="bg-aurora-bg/80 p-6 rounded-xl border border-aurora-border overflow-hidden">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-aurora-text/80 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {content.mega_prompt}
                            </pre>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GlowingButton onClick={() => copyToClipboard(content.mega_prompt)} className="text-xs px-4 py-2">
                                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </GlowingButton>
                        </div>
                        <p className="mt-4 text-center text-sm text-aurora-muted">
                            Paste this prompt into <strong>Cursor</strong>, <strong>Windsurf</strong>, or any AI coding assistant.
                        </p>
                    </motion.div>
                )}

                {activeTab === 'agents' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {/* Starter Prompt Card */}
                        {content.starter_prompt && (
                            <GlassCard className="bg-gradient-to-br from-aurora-primary/10 to-aurora-secondary/5 border-aurora-primary/30">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-aurora-primary/20 flex items-center justify-center">
                                            <Sparkles className="text-aurora-primary" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-aurora-text">Your First Message</h3>
                                            <p className="text-sm text-aurora-muted">Paste this as your first message to the AI coder</p>
                                        </div>
                                    </div>
                                    <GlowingButton
                                        onClick={() => copyToClipboard(content.starter_prompt)}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </GlowingButton>
                                </div>
                                <div className="bg-aurora-bg/50 rounded-lg p-4 text-sm text-aurora-text/80 leading-relaxed">
                                    {content.starter_prompt}
                                </div>
                            </GlassCard>
                        )}

                        {/* Task Breakdown Section */}
                        <GlassCard className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/30">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                        <ListChecks className="text-cyan-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-aurora-text">Implementation Tasks</h3>
                                        <p className="text-sm text-aurora-muted">
                                            {taskBreakdown ? `${taskBreakdown.phases?.length || 0} phases · ~${taskBreakdown.total_estimated_hours || '?'}h estimated` : 'AI-generated build checklist'}
                                        </p>
                                    </div>
                                </div>
                                {!taskBreakdown && (
                                    <GlowingButton
                                        onClick={handleTaskBreakdown}
                                        disabled={isLoadingTasks}
                                    >
                                        {isLoadingTasks ? 'Generating...' : 'Break into Tasks'}
                                        {!isLoadingTasks && <Zap size={16} />}
                                    </GlowingButton>
                                )}
                            </div>

                            {/* Task Breakdown Results */}
                            <AnimatePresence>
                                {taskBreakdown && taskBreakdown.phases && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4"
                                    >
                                        {(taskBreakdown.phases as TaskPhase[]).map((phase: TaskPhase, phaseIdx: number) => (
                                            <div key={phaseIdx} className="space-y-2">
                                                <h4 className="font-semibold text-cyan-300 text-sm uppercase tracking-wider flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
                                                        {phaseIdx + 1}
                                                    </span>
                                                    {phase.name}
                                                </h4>
                                                <div className="space-y-1.5 pl-8">
                                                    {phase.tasks.map((task: TaskItem) => (
                                                        <motion.div
                                                            key={task.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: task.id * 0.03 }}
                                                            onClick={() => toggleTaskDone(task.id)}
                                                            className={cn(
                                                                "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all group",
                                                                completedTasks.has(task.id)
                                                                    ? "bg-green-500/10 border-green-500/30 opacity-60"
                                                                    : "bg-aurora-surface/30 border-aurora-border hover:border-cyan-500/30"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                                                                completedTasks.has(task.id)
                                                                    ? "bg-green-500 text-white"
                                                                    : "border border-aurora-border group-hover:border-cyan-400"
                                                            )}>
                                                                {completedTasks.has(task.id) && <Check size={12} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                    <span className={cn(
                                                                        "font-medium text-sm",
                                                                        completedTasks.has(task.id) ? "text-green-300 line-through" : "text-aurora-text"
                                                                    )}>
                                                                        {task.title}
                                                                    </span>
                                                                    <span className={cn(
                                                                        "text-xs px-1.5 py-0.5 rounded-full",
                                                                        task.priority === 'critical' ? "bg-red-500/20 text-red-400" :
                                                                        task.priority === 'high' ? "bg-orange-500/20 text-orange-400" :
                                                                        task.priority === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                                                                        "bg-blue-500/20 text-blue-400"
                                                                    )}>
                                                                        {task.priority}
                                                                    </span>
                                                                    <span className="text-xs text-aurora-muted">
                                                                        ~{task.estimated_hours}h
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-aurora-muted leading-relaxed">
                                                                    {task.description}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Progress Summary */}
                                        <div className="flex items-center justify-between pt-3 border-t border-aurora-border/30">
                                            <span className="text-sm text-aurora-muted">
                                                {completedTasks.size} / {totalTasks} tasks done
                                            </span>
                                            <div className="w-32 h-2 rounded-full bg-aurora-surface overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-400 transition-all"
                                                    style={{ width: `${totalTasks > 0 ? (completedTasks.size / totalTasks) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Empty State */}
                            {!taskBreakdown && !isLoadingTasks && (
                                <p className="text-sm text-aurora-muted leading-relaxed">
                                    Click "Break into Tasks" to generate an ordered implementation checklist from your spec.
                                    You&#39;ll get phases, priorities, and time estimates — perfect for staying organized while building.
                                </p>
                            )}
                        </GlassCard>

                        {/* What's Next Checklist */}
                        <GlassCard className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30">
                            <h3 className="text-xl font-bold text-aurora-text mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Rocket className="text-green-400" size={20} />
                                </div>
                                Ready to Build Your App!
                            </h3>

                            <div className="space-y-4">
                                {[
                                    {
                                        step: 1,
                                        title: "Export Your Prompt",
                                        description: "Click the Export button above and choose your AI coding tool.",
                                        done: copied
                                    },
                                    {
                                        step: 2,
                                        title: "Open Your AI Coding Tool",
                                        description: "Launch Cursor, Windsurf, Bolt, or any AI coding assistant you prefer."
                                    },
                                    {
                                        step: 3,
                                        title: "Paste & Start Building",
                                        description: "Create a new project and paste the starter prompt. The AI will build your app step by step!"
                                    },
                                    {
                                        step: 4,
                                        title: "Review & Test",
                                        description: "Check the generated code, run it locally, and iterate on any changes you want."
                                    }
                                ].map((item) => (
                                    <motion.div
                                        key={item.step}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: item.step * 0.1 }}
                                        className={cn(
                                            "flex gap-4 p-4 rounded-xl border transition-all",
                                            item.done
                                                ? "bg-green-500/20 border-green-500/50"
                                                : "bg-aurora-surface/30 border-aurora-border hover:border-green-500/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm",
                                            item.done
                                                ? "bg-green-500 text-aurora-text"
                                                : "bg-aurora-primary/20 text-aurora-primary"
                                        )}>
                                            {item.done ? <Check size={16} /> : item.step}
                                        </div>
                                        <div>
                                            <h4 className={cn(
                                                "font-semibold mb-1",
                                                item.done ? "text-green-300" : "text-aurora-text"
                                            )}>
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-aurora-muted">
                                                {item.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pro Tip */}
                            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                <p className="text-sm text-amber-200">
                                    <strong className="text-amber-400">Pro Tip:</strong> If the AI makes mistakes, just tell it what's wrong!
                                    Say something like "The login button should be blue" or "Add a search feature to the homepage".
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {activeTab === 'guides' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {content.manual_guides && content.manual_guides.length > 0 ? (
                            <>
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                        <BookOpen className="text-amber-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-aurora-text">Setup Guides</h3>
                                        <p className="text-sm text-aurora-muted">Complete these before running your app</p>
                                    </div>
                                </div>

                                {content.manual_guides.map((guide, i) => (
                                    <GlassCard
                                        key={i}
                                        className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30"
                                    >
                                        <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-200">
                                                {i + 1}
                                            </div>
                                            {guide.title}
                                        </h3>
                                        <div className="space-y-3 pl-2">
                                            {guide.steps.map((step, j) => (
                                                <motion.div
                                                    key={j}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: j * 0.05 }}
                                                    className="flex items-start gap-3 p-3 rounded-lg bg-aurora-surface/30 border border-aurora-border hover:border-amber-500/30 transition-colors group"
                                                >
                                                    <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-center flex-shrink-0">
                                                        {j + 1}
                                                    </span>
                                                    <span className="text-aurora-text/90 flex-1">{step}</span>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(step)}
                                                        className="opacity-0 group-hover:opacity-100 text-aurora-muted hover:text-amber-400 transition-all p-1"
                                                        title="Copy step"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                ))}
                            </>
                        ) : (
                            <GlassCard className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30">
                                <div className="text-center py-8">
                                    <CheckCircle2 size={56} className="mx-auto mb-4 text-green-400" />
                                    <h3 className="text-xl font-bold text-aurora-text mb-2">No Manual Setup Required! 🎉</h3>
                                    <p className="text-aurora-muted max-w-md mx-auto">
                                        Great news! This project can be built entirely with the mega-prompt.
                                        Just copy it and paste into your AI coding tool.
                                    </p>
                                </div>
                            </GlassCard>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Refine Section */}
            <div className="pt-8 border-t border-aurora-border space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <RefreshCw size={18} className="text-aurora-primary" />
                    Need Changes?
                </h3>

                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <textarea
                            value={refineText}
                            onChange={(e) => setRefineText(e.target.value)}
                            placeholder="E.g. Add user profiles, change database to PostgreSQL, include dark mode..."
                            rows={2}
                            className="w-full bg-aurora-bg/50 border border-aurora-border rounded-lg p-4 text-aurora-text placeholder:text-aurora-muted focus:outline-none focus:border-aurora-primary transition-colors resize-none"
                        />
                        <div className="absolute bottom-3 right-3">
                            <GlowingButton
                                onClick={handleRefine}
                                disabled={loading || isRefining || !refineText.trim()}
                                variant="secondary"
                                className="px-4 py-1 text-sm h-8"
                            >
                                {isRefining ? 'Updating...' : 'Refine Spec'}
                            </GlowingButton>
                        </div>
                    </div>

                    <button
                        onClick={onReset}
                        className="text-aurora-muted hover:text-aurora-text text-sm flex items-center gap-1 transition-colors px-4 py-2 h-fit self-end"
                    >
                        New Project <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
