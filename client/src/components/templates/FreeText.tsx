import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { GlassCard } from '../ui/GlassCard';
import { ArrowRight } from 'lucide-react';

interface Props {
    content: UIContent;
    onSubmit: (answer: string) => void;
    loading?: boolean;
}

export const FreeText: React.FC<Props> = ({ content, onSubmit, loading }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (value.trim()) onSubmit(value);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-aurora-text">{content.question_text}</h3>
            {content.explanation && (
                <div className="text-aurora-muted prose prose-invert max-w-none">
                    <ReactMarkdown>{content.explanation}</ReactMarkdown>
                </div>
            )}

            <GlassCard className="p-0 overflow-hidden">
                <textarea
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="w-full bg-transparent p-4 text-aurora-text placeholder:text-aurora-muted/50 focus:outline-none resize-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
            </GlassCard>

            <div className="flex justify-end">
                <GlowingButton onClick={handleSubmit} disabled={loading || !value.trim()}>
                    Next <ArrowRight size={18} />
                </GlowingButton>
            </div>
        </div>
    );
};
