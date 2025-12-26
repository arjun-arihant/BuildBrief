import React, { useState } from 'react';
import { UIContent } from '../../types';

interface Props {
    content: UIContent;
    onRefine?: (comments: string) => void;
    onReset?: () => void;
}

export const FinalOutput: React.FC<Props> = ({ content, onRefine, onReset }) => {
    const [activeTab, setActiveTab] = useState<'spec' | 'prompt' | 'guides'>('spec');
    const [copied, setCopied] = useState(false);
    const [refineText, setRefineText] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const copyToClipboard = () => {
        if (content.mega_prompt) {
            navigator.clipboard.writeText(content.mega_prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRefine = async () => {
        if (!onRefine || !refineText.trim()) return;
        setIsRefining(true);
        await onRefine(refineText);
        setIsRefining(false);
        setRefineText('');
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{content.project_name || "Project Blueprint"}</h2>
                <p style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>{content.app_tagline}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <button
                    className="btn-secondary"
                    style={{
                        borderBottom: activeTab === 'spec' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        border: 'none',
                        borderRadius: 0,
                        color: activeTab === 'spec' ? 'white' : 'var(--color-text-dim)',
                        paddingBottom: '10px'
                    }}
                    onClick={() => setActiveTab('spec')}
                >
                    Specification
                </button>
                <button
                    className="btn-secondary"
                    style={{
                        borderBottom: activeTab === 'prompt' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        border: 'none',
                        borderRadius: 0,
                        color: activeTab === 'prompt' ? 'white' : 'var(--color-text-dim)',
                        paddingBottom: '10px'
                    }}
                    onClick={() => setActiveTab('prompt')}
                >
                    AI Mega-Prompt
                </button>
                <button
                    className="btn-secondary"
                    style={{
                        borderBottom: activeTab === 'guides' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        border: 'none',
                        borderRadius: 0,
                        color: activeTab === 'guides' ? 'white' : 'var(--color-text-dim)',
                        paddingBottom: '10px'
                    }}
                    onClick={() => setActiveTab('guides')}
                >
                    Integration Guides
                </button>
            </div>

            <div className="fade-in">
                {activeTab === 'spec' && (
                    <div>
                        <h3>Features</h3>
                        <ul className="feature-list" style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                            {content.features_list?.map((f, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem' }}>{f}</li>
                            ))}
                        </ul>

                        <h3>Tech Stack</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {content.tech_stack_recommendation?.map((t, i) => (
                                <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'prompt' && (
                    <div>
                        <div style={{
                            position: 'relative',
                            background: '#0a0a0a',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                        }}>
                            <pre style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                color: '#cbd5e1',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {content.mega_prompt}
                            </pre>
                            <button
                                className="btn-primary"
                                onClick={copyToClipboard}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {copied ? 'Copied!' : 'Copy Prompt'}
                            </button>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>
                            Paste this prompt into a coding agent (like me!) or ChatGPT to build your app.
                        </p>
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div>
                        {content.manual_guides && content.manual_guides.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {content.manual_guides.map((guide, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '1.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)'
                                    }}>
                                        <h3 style={{ marginTop: 0, color: 'var(--color-primary)' }}>{guide.title}</h3>
                                        <ol style={{ marginLeft: '1.5rem', color: 'var(--color-text-dim)' }}>
                                            {guide.steps.map((step, j) => (
                                                <li key={j} style={{ marginBottom: '0.5rem' }}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--color-text-dim)', fontStyle: 'italic' }}>
                                No manual integrations required for this project.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                <h3>Not quite right? Refine it.</h3>
                <textarea
                    value={refineText}
                    onChange={(e) => setRefineText(e.target.value)}
                    placeholder="E.g. I changed my mind, I want to use PostgreSQL instead of MongoDB..."
                    rows={3}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        className="btn-primary"
                        onClick={handleRefine}
                        disabled={isRefining || !refineText.trim()}
                    >
                        {isRefining ? 'Updating...' : 'Finetune Prompt'}
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={onReset}
                        style={{ border: '1px solid var(--color-border)' }}
                    >
                        Build Another App
                    </button>
                </div>
            </div>
        </div>
    );
};
