import React from 'react';
import { AIResponse } from '../types';
import { FreeText } from './templates/FreeText';
import { Choice } from './templates/Choice';
import { ManualAction } from './templates/ManualAction';
import { Explanation } from './templates/Explanation';
import { FinalOutput } from './templates/FinalOutput';

interface Props {
    step: AIResponse;
    onSubmit: (answer: string) => void;
    onRefine?: (comments: string) => void;
    onReset?: () => void;
    loading: boolean;
}

export const TemplateRenderer: React.FC<Props> = ({ step, onSubmit, onRefine, onReset, loading }) => {
    if (loading) {
        // Opacity handled by parent overlay, but we can disable here too
    }

    const { template, content } = step;
    const { auto_decisions } = content;

    return (
        <div className="fade-in">
            {/* V3: Auto-Decision Notifications */}
            {auto_decisions && auto_decisions.length > 0 && (
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {auto_decisions.map((decision, i) => (
                        <div key={i} style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderLeft: '4px solid #60a5fa',
                            padding: '1rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.9rem'
                        }}>
                            <strong style={{ color: '#93c5fd', display: 'block', marginBottom: '0.25rem' }}>
                                ⚡ Auto-Decision: {decision.decision}
                            </strong>
                            <span style={{ color: '#cbd5e1' }}>{decision.reason}</span>
                        </div>
                    ))}
                </div>
            )}

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
        </div>
    );
};
