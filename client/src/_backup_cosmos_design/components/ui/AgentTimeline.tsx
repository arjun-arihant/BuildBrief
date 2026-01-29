import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { GlassCard } from './GlassCard';
import { Users, Code, TestTube, Shield, Rocket, Clock, CheckCircle2 } from 'lucide-react';

interface Agent {
    name: string;
    role: string;
    tasks: string[];
}

interface Phase {
    id: number;
    name: string;
    duration: string;
    agents: Agent[];
}

interface AgentPlan {
    project_name: string;
    total_phases: number;
    estimated_days: number;
    phases: Phase[];
    instructions?: string;
}

interface Props {
    agentMd: string;
}

// Use type assertion to avoid LucideIcon props type mismatch
const agentIcons: Record<string, typeof Users> = {
    'project-planner': Users,
    'frontend-specialist': Code,
    'backend-specialist': Code,
    'test-engineer': TestTube,
    'security-auditor': Shield,
    'devops-engineer': Rocket,
    'database-architect': Code,
    'mobile-developer': Code,
    'ai-ml-engineer': Code,
};

const agentColors: Record<string, string> = {
    'project-planner': 'from-blue-500 to-cyan-400',
    'frontend-specialist': 'from-violet-500 to-purple-400',
    'backend-specialist': 'from-emerald-500 to-teal-400',
    'test-engineer': 'from-amber-500 to-yellow-400',
    'security-auditor': 'from-red-500 to-orange-400',
    'devops-engineer': 'from-indigo-500 to-blue-400',
    'database-architect': 'from-pink-500 to-rose-400',
    'mobile-developer': 'from-cyan-500 to-sky-400',
    'ai-ml-engineer': 'from-fuchsia-500 to-pink-400',
};

export const AgentTimeline: React.FC<Props> = ({ agentMd }) => {
    let plan: AgentPlan | null = null;

    try {
        plan = JSON.parse(agentMd);
    } catch {
        // Fallback for markdown format
        return (
            <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="text-cosmos-primary" size={20} />
                    <h3 className="text-lg font-semibold">Build Team Plan</h3>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-cosmos-muted max-h-[400px] overflow-y-auto">
                    {agentMd}
                </pre>
            </GlassCard>
        );
    }

    if (!plan || !plan.phases) {
        return (
            <div className="text-center text-cosmos-muted py-10">
                No agent plan available.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-4">
                <GlassCard className="text-center py-4">
                    <div className="text-3xl font-bold text-cosmos-primary">{plan.total_phases}</div>
                    <div className="text-sm text-cosmos-muted">Phases</div>
                </GlassCard>
                <GlassCard className="text-center py-4">
                    <div className="text-3xl font-bold text-cosmos-secondary">{plan.estimated_days}</div>
                    <div className="text-sm text-cosmos-muted">Est. Days</div>
                </GlassCard>
                <GlassCard className="text-center py-4">
                    <div className="text-3xl font-bold text-green-400">
                        {plan.phases.reduce((acc, p) => acc + p.agents.length, 0)}
                    </div>
                    <div className="text-sm text-cosmos-muted">Agents</div>
                </GlassCard>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cosmos-primary via-cosmos-secondary to-green-400" />

                {plan.phases.map((phase, phaseIdx) => (
                    <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: phaseIdx * 0.15 }}
                        className="relative pl-16 pb-8 last:pb-0"
                    >
                        {/* Phase Marker */}
                        <div className={cn(
                            "absolute left-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold",
                            phaseIdx === 0 ? "bg-cosmos-primary" :
                                phaseIdx === plan!.phases.length - 1 ? "bg-green-500" :
                                    "bg-cosmos-secondary"
                        )}>
                            {phase.id}
                        </div>

                        {/* Phase Content */}
                        <GlassCard className="relative overflow-hidden">
                            {/* Phase Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">{phase.name}</h3>
                                <div className="flex items-center gap-1 text-cosmos-muted text-sm">
                                    <Clock size={14} />
                                    {phase.duration}
                                </div>
                            </div>

                            {/* Agents */}
                            <div className="space-y-3">
                                {phase.agents.map((agent, agentIdx) => {
                                    const Icon = agentIcons[agent.name] || Users;
                                    const colorClass = agentColors[agent.name] || 'from-gray-500 to-gray-400';

                                    return (
                                        <motion.div
                                            key={agentIdx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: phaseIdx * 0.15 + agentIdx * 0.1 }}
                                            className="flex gap-3 items-start"
                                        >
                                            {/* Agent Icon */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                                                colorClass
                                            )}>
                                                <Icon size={20} className="text-white" />
                                            </div>

                                            {/* Agent Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-white">
                                                        {agent.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                    </span>
                                                    <span className={cn(
                                                        "text-xs px-2 py-0.5 rounded-full",
                                                        agent.role === 'Lead' ? "bg-cosmos-primary/20 text-cosmos-primary" :
                                                            agent.role === 'Parallel' ? "bg-cosmos-secondary/20 text-cosmos-secondary" :
                                                                "bg-white/10 text-cosmos-muted"
                                                    )}>
                                                        {agent.role}
                                                    </span>
                                                </div>
                                                <ul className="text-sm text-cosmos-muted space-y-0.5">
                                                    {agent.tasks.map((task, taskIdx) => (
                                                        <li key={taskIdx} className="flex items-start gap-2">
                                                            <CheckCircle2 size={12} className="mt-1 text-green-400 flex-shrink-0" />
                                                            {task}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Instructions */}
            {plan.instructions && (
                <GlassCard className="bg-cosmos-primary/10 border-cosmos-primary/30">
                    <div className="flex items-start gap-3">
                        <Rocket className="text-cosmos-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="font-semibold text-white mb-1">How to Use This Plan</h4>
                            <p className="text-sm text-cosmos-muted">{plan.instructions}</p>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};
