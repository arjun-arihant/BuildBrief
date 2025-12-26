import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UIContent } from '../../types';

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
        <div>
            <h3>{content.question_text}</h3>
            {content.explanation && (
                <div style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>
                    <ReactMarkdown>{content.explanation}</ReactMarkdown>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {content.options?.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                        <div
                            key={opt.value}
                            onClick={() => toggleOption(opt.value)}
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid',
                                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                                background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.2s',
                                boxShadow: isSelected ? '0 0 10px rgba(59,130,246,0.1)' : 'none'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: type === 'single_choice' ? '50%' : '4px',
                                border: '2px solid',
                                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-text-dim)',
                                marginRight: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {isSelected && <div style={{
                                    width: '10px',
                                    height: '10px',
                                    background: 'var(--color-primary)',
                                    borderRadius: type === 'single_choice' ? '50%' : '2px'
                                }} />}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{
                                    color: isSelected ? 'white' : 'var(--color-text-dim)',
                                    fontWeight: isSelected ? 500 : 400
                                }}>
                                    {opt.label}
                                </span>
                                {opt.explanation && (
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-dim)',
                                        marginTop: '0.25rem',
                                        opacity: 0.8
                                    }}>
                                        <ReactMarkdown>{opt.explanation}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={selected.length === 0}
                >
                    {type === 'single_choice' ? 'Confirm selection' : 'Confirm selections'}
                </button>
            </div>
        </div>
    );
};
