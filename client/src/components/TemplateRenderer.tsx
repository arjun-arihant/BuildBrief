import React from 'react';
import { AIResponse } from '../types';
import { FreeText } from './templates/FreeText';
import { Choice } from './templates/Choice';
import { ManualAction } from './templates/ManualAction';
import { Explanation } from './templates/Explanation';
import { FinalOutput } from './templates/FinalOutput';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface Props {
    step: AIResponse;
    onSubmit: (answer: string) => void;
    onRefine?: (comments: string) => void;
    onReset?: () => void;
    loading: boolean;
}

export const TemplateRenderer: React.FC<Props> = ({ step, onSubmit, onRefine, onReset }) => {
    const { template, content } = step;
    const { auto_decisions } = content;

    return (
        <div className="w-full max-w-3xl mx-auto pb-20">
            {/* Auto-Decision Notifications */}
            {auto_decisions && auto_decisions.length > 0 && (
                <div className="mb-8 space-y-4">
                    {auto_decisions.map((decision, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-3 bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg"
                        >
                            <Zap className="text-blue-400 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <strong className="text-blue-300 block mb-1">Auto-Decision: {decision.decision}</strong>
                                <span className="text-blue-200/70 text-sm">{decision.reason}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <GlassCard className="p-8 md:p-10 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cosmos-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                {(() => {
                    switch (template) {
                        case 'free_text':
                            return <FreeText content={content} onSubmit={onSubmit} />;
                        case 'single_choice':
                        case 'multi_choice':
                            return <Choice content={content} type={template} onSubmit={onSubmit} />;
                        case 'manual_action':
                            return <ManualAction content={content} onSubmit={onSubmit} />;
                        case 'explanation_only':
                            return <Explanation content={content} onSubmit={onSubmit} />;
                        case 'summary':
                        case 'final_output':
                            return <FinalOutput content={content} onRefine={onRefine} onReset={onReset} />;
                        default:
                            return <div>Unknown template: {template}</div>;
                    }
                })()}
            </GlassCard>
        </div>
    );
};
