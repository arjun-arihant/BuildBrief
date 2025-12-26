import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';

interface Props {
    content: UIContent;
    onSubmit: (answer: string) => void;
}

export const FreeText: React.FC<Props> = ({ content, onSubmit }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (value.trim()) onSubmit(value);
    };

    return (
        <div>
            <h3>{content.question_text}</h3>
            {content.explanation && (
                <div style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    <ReactMarkdown>{content.explanation}</ReactMarkdown>
                </div>
            )}

            <textarea
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
                style={{ marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={!value.trim()}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
