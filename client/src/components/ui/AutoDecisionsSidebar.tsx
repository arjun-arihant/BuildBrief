import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AutoDecision {
    decision: string;
    reason: string;
}

interface Props {
    decisions: AutoDecision[];
    newDecisions?: AutoDecision[];
}

export const AutoDecisionsSidebar: React.FC<Props> = ({ decisions, newDecisions = [] }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    if (!decisions || decisions.length === 0) return null;

    const newSet = new Set(newDecisions.map(d => d.decision));
    const previousDecisions = decisions.filter(d => !newSet.has(d.decision));

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed right-6 top-32 w-80 z-40">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-aurora-surface/90 backdrop-blur-xl border border-aurora-border rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-500/10 border-b border-aurora-border">
                        <div className="flex items-center gap-2">
                            <Zap className="text-blue-400" size={18} />
                            <span className="font-semibold text-blue-300 text-sm">
                                Auto-Decisions ({decisions.length})
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-aurora-muted hover:text-aurora-text transition-colors p-1"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <X size={16} />}
                        </button>
                    </div>

                    {/* Decisions List */}
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="max-h-[60vh] overflow-y-auto"
                            >
                                <div className="p-3 space-y-3">
                                    {/* New Decisions */}
                                    {newDecisions.length > 0 && (
                                        <>
                                            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-1">
                                                New This Step
                                            </div>
                                            {newDecisions.map((decision, i) => (
                                                <motion.div
                                                    key={`new-${i}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
                                                >
                                                    <p className="text-blue-200 font-medium text-sm mb-1">
                                                        {decision.decision}
                                                    </p>
                                                    <p className="text-blue-300/60 text-xs">
                                                        {decision.reason}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </>
                                    )}

                                    {/* Previous Decisions */}
                                    {previousDecisions.length > 0 && (
                                        <>
                                            {newDecisions.length > 0 && (
                                                <div className="text-xs font-semibold text-aurora-muted uppercase tracking-wider px-1 pt-2">
                                                    Previous Decisions
                                                </div>
                                            )}
                                            {previousDecisions.map((decision, i) => (
                                                <motion.div
                                                    key={`prev-${i}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: (newDecisions.length + i) * 0.05 }}
                                                    className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15 opacity-70"
                                                >
                                                    <p className="text-blue-200/80 font-medium text-sm mb-1">
                                                        {decision.decision}
                                                    </p>
                                                    <p className="text-blue-300/40 text-xs">
                                                        {decision.reason}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Mobile Floating Badge */}
            <div className="lg:hidden fixed right-4 bottom-24 z-40">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full",
                        "bg-blue-500/20 border border-blue-500/40",
                        "text-blue-300 font-medium text-sm",
                        "shadow-lg shadow-blue-500/20",
                        "hover:bg-blue-500/30 transition-colors"
                    )}
                >
                    <Zap size={16} />
                    {decisions.length} decisions made
                    {newDecisions.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-400/30 text-xs">
                            +{newDecisions.length}
                        </span>
                    )}
                </button>

                {/* Mobile Popup */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-14 right-0 w-80 bg-aurora-surface/95 backdrop-blur-xl border border-aurora-border rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                                {newDecisions.map((decision, i) => (
                                    <div
                                        key={`new-${i}`}
                                        className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
                                    >
                                        <p className="text-blue-200 font-medium text-sm">
                                            {decision.decision}
                                        </p>
                                        <p className="text-blue-300/60 text-xs mt-1">
                                            {decision.reason}
                                        </p>
                                    </div>
                                ))}
                                {previousDecisions.map((decision, i) => (
                                    <div
                                        key={`prev-${i}`}
                                        className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15 opacity-70"
                                    >
                                        <p className="text-blue-200/80 font-medium text-sm">
                                            {decision.decision}
                                        </p>
                                        <p className="text-blue-300/40 text-xs mt-1">
                                            {decision.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};
