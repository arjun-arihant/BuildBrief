import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { Input } from '../ui/Input';
import { Check, ArrowRight, Pencil } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface Props {
    content: UIContent;
    type: 'single_choice' | 'multi_choice';
    onSubmit: (answer: string) => void;
    loading?: boolean;
}

export const Choice: React.FC<Props> = ({ content, type, onSubmit, loading }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [customAnswer, setCustomAnswer] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const toggleOption = (value: string) => {
        if (loading) return;
        // Clear custom answer when selecting an option
        setCustomAnswer('');
        setShowCustomInput(false);

        if (type === 'single_choice') {
            setSelected([value]);
        } else {
            if (selected.includes(value)) {
                setSelected(selected.filter(s => s !== value));
            } else {
                setSelected([...selected, value]);
            }
        }
    };

    const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAnswer(e.target.value);
        // Clear selections when typing custom answer (for single choice)
        if (type === 'single_choice' && e.target.value) {
            setSelected([]);
        }
    };

    const handleSubmit = () => {
        if (customAnswer.trim()) {
            // If custom answer is provided, use it
            if (type === 'multi_choice' && selected.length > 0) {
                // For multi-choice, combine selections with custom answer
                onSubmit([...selected, customAnswer.trim()].join(', '));
            } else {
                onSubmit(customAnswer.trim());
            }
        } else if (selected.length > 0) {
            onSubmit(selected.join(', '));
        }
    };

    const canSubmit = selected.length > 0 || customAnswer.trim().length > 0;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-aurora-text">{content.question_text}</h3>
            {content.explanation && (
                <div className="text-aurora-muted prose prose-invert max-w-none">
                    <ReactMarkdown>{content.explanation}</ReactMarkdown>
                </div>
            )}

            <div className="grid gap-3">
                {content.options?.map((opt, index) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                        <motion.div
                            key={opt.value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => toggleOption(opt.value)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={cn(
                                "flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                isSelected
                                    ? "bg-aurora-primary/20 border-aurora-primary shadow-lg shadow-aurora-primary/10"
                                    : "bg-aurora-surface/50 border-aurora-border hover:bg-aurora-surfaceHover/50 hover:border-aurora-primary/30"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-full border mr-4 mt-0.5 flex-shrink-0 transition-all duration-200",
                                isSelected
                                    ? "bg-aurora-primary border-aurora-primary scale-110"
                                    : "border-aurora-muted/50 bg-transparent"
                            )}>
                                {isSelected && <Check size={14} className="text-white" />}
                            </div>
                            <div className="flex-1">
                                <span className={cn("font-medium block", isSelected ? "text-aurora-text" : "text-aurora-text")}>
                                    {opt.label}
                                </span>
                                {opt.explanation && (
                                    <div className="text-sm text-aurora-muted mt-1 leading-relaxed">
                                        <ReactMarkdown>{opt.explanation}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {/* Custom Answer Option */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (content.options?.length || 0) * 0.05 }}
                    onClick={() => setShowCustomInput(true)}
                    whileHover={{ scale: 1.01 }}
                    className={cn(
                        "flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200",
                        showCustomInput || customAnswer
                            ? "bg-aurora-secondary/20 border-aurora-secondary shadow-lg shadow-aurora-secondary/10"
                            : "bg-aurora-surface/30 border-dashed border-aurora-border/50 hover:bg-aurora-surface/50"
                    )}
                >
                    <div className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full border mr-4 mt-0.5 flex-shrink-0 transition-all duration-200",
                        customAnswer
                            ? "bg-aurora-secondary border-aurora-secondary"
                            : "border-aurora-muted/50 bg-transparent"
                    )}>
                        <Pencil size={12} className={customAnswer ? "text-white" : "text-aurora-muted"} />
                    </div>
                    <div className="flex-1">
                        <span className={cn("font-medium block mb-2", customAnswer ? "text-aurora-text" : "text-aurora-muted")}>
                            Or type your own answer...
                        </span>
                        {showCustomInput && (
                            <Input
                                value={customAnswer}
                                onChange={handleCustomInputChange}
                                placeholder="Enter your custom answer..."
                                className="mt-2"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="flex justify-end pt-2">
                <GlowingButton
                    onClick={handleSubmit}
                    disabled={loading || !canSubmit}
                    icon={<ArrowRight size={18} />}
                    iconPosition="right"
                >
                    {type === 'single_choice' ? 'Confirm selection' : 'Confirm selections'}
                </GlowingButton>
            </div>
        </div>
    );
};
