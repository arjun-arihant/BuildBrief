import React, { useState } from 'react';
import { UIContent } from '../../types';

interface Props {
    content: UIContent;
    onSubmit: (answer: string) => void;
}

export const ManualAction: React.FC<Props> = ({ content, onSubmit }) => {
    const [done, setDone] = useState(false);

    return (
        <div>
            <h3 style={{ color: '#fbbf24' }}> Action Required</h3>
            <h3>{content.question_text || content.action_title}</h3>

            <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '2rem'
            }}>
                <p style={{ marginTop: 0, fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {content.explanation || content.action_description}
                </p>
            </div>

            <div
                onClick={() => setDone(!done)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '2rem'
                }}
            >
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: done ? '#fbbf24' : 'var(--color-text-dim)',
                    marginRight: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: done ? '#fbbf24' : 'transparent'
                }}>
                    {done && <span style={{ color: 'black', fontWeight: 'bold' }}>✓</span>}
                </div>
                <span>I have completed this step</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-primary"
                    onClick={() => onSubmit("Action Completed")}
                    disabled={!done}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
