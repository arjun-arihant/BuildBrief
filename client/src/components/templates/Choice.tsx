import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface Props {
    content: UIContent;
    type: 'single_choice' | 'multi_choice';
    onSubmit: (answer: string) => void;
}

export const Choice: React.FC<Props> = ({ content, type, onSubmit }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleOption = (value: string) => {
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

    const handleSubmit = () => {
        if (selected.length > 0) {
            onSubmit(selected.join(', '));
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-cosmos-text">{content.question_text}</h3>
            {content.explanation && (
                <div className="text-cosmos-muted prose prose-invert max-w-none">
                    <ReactMarkdown>{content.explanation}</ReactMarkdown>
                </div>
            )}

            <div className="grid gap-4">
                {content.options?.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                        <motion.div
                            key={opt.value}
                            onClick={() => toggleOption(opt.value)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={cn(
                                "flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                isSelected
                                    ? "bg-cosmos-primary/20 border-cosmos-primary shadow-lg shadow-cosmos-primary/10"
                                    : "bg-cosmos-card/30 border-cosmos-border hover:bg-cosmos-card/50"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-full border mr-4 mt-1 flex-shrink-0 transition-colors",
                                isSelected ? "bg-cosmos-primary border-cosmos-primary" : "border-cosmos-muted bg-transparent"
                            )}>
                                {isSelected && <Check size={14} className="text-white" />}
                            </div>
                            <div>
                                <span className={cn("font-medium block", isSelected ? "text-white" : "text-cosmos-text")}>
                                    {opt.label}
                                </span>
                                {opt.explanation && (
                                    <div className="text-sm text-cosmos-muted mt-1">
                                        <ReactMarkdown>{opt.explanation}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <GlowingButton onClick={handleSubmit} disabled={selected.length === 0}>
                    {type === 'single_choice' ? 'Confirm selection' : 'Confirm selections'} <ArrowRight size={18} />
                </GlowingButton>
            </div>
        </div>
    );
};
