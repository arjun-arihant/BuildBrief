import React from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { Check } from 'lucide-react';

interface Props {
    content: UIContent;
    onSubmit: (answer: string) => void;
}

export const Explanation: React.FC<Props> = ({ content, onSubmit }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-cosmos-text">{content.question_text}</h3>

            <div className="text-cosmos-muted prose prose-invert max-w-none leading-relaxed">
                <ReactMarkdown>{content.explanation || ''}</ReactMarkdown>
            </div>

            <div className="flex justify-end">
                <GlowingButton onClick={() => onSubmit("Acknowledged")}>
                    Got it <Check className="ml-2" size={18} />
                </GlowingButton>
            </div>
        </div>
    );
};
