import React from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { Check } from 'lucide-react';

interface Props {
    content: UIContent;
    onSubmit: (answer: string) => void;
    loading?: boolean;
}

export const Explanation: React.FC<Props> = ({ content, onSubmit, loading }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-aurora-text">{content.question_text}</h3>

            <div className="text-aurora-muted prose prose-invert max-w-none leading-relaxed">
                <ReactMarkdown>{content.explanation || ''}</ReactMarkdown>
            </div>

            <div className="flex justify-end">
                <GlowingButton onClick={() => onSubmit("Acknowledged")} disabled={loading} loading={loading}>
                    Got it <Check className="ml-2" size={18} />
                </GlowingButton>
            </div>
        </div>
    );
};
