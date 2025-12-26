import React from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';

interface Props {
    content: UIContent;
    onSubmit: (answer: string) => void;
}

export const Explanation: React.FC<Props> = ({ content, onSubmit }) => {
    return (
        <div>
            <h3>{content.question_text}</h3>
            <div style={{ lineHeight: '1.6', color: 'var(--color-text-dim)', marginBottom: '2rem' }}>
                <ReactMarkdown>{content.explanation || ''}</ReactMarkdown>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-primary"
                    onClick={() => onSubmit("Acknowledged")}
                >
                    Got it
                </button>
            </div>
        </div>
    );
};
