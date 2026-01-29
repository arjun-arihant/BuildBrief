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
}

export const AutoDecisionsSidebar: React.FC<Props> = ({ decisions }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    if (!decisions || decisions.length === 0) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed right-6 top-32 w-80 z-40">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-cosmos-card/90 backdrop-blur-xl border border-cosmos-border rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-500/10 border-b border-cosmos-border">
                        <div className="flex items-center gap-2">
                            <Zap className="text-blue-400" size={18} />
                            <span className="font-semibold text-blue-300 text-sm">
                                Auto-Decisions ({decisions.length})
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-cosmos-muted hover:text-white transition-colors p-1"
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
                                    {decisions.map((decision, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20"
                                        >
                                            <p className="text-blue-200 font-medium text-sm mb-1">
                                                {decision.decision}
                                            </p>
                                            <p className="text-blue-300/60 text-xs">
                                                {decision.reason}
                                            </p>
                                        </motion.div>
                                    ))}
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
                </button>

                {/* Mobile Popup */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-14 right-0 w-80 bg-cosmos-card/95 backdrop-blur-xl border border-cosmos-border rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                                {decisions.map((decision, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20"
                                    >
                                        <p className="text-blue-200 font-medium text-sm">
                                            {decision.decision}
                                        </p>
                                        <p className="text-blue-300/60 text-xs mt-1">
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
