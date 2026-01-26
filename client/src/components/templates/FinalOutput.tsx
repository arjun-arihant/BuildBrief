import React, { useState } from 'react';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { GlassCard } from '../ui/GlassCard';
import { Copy, Check, RefreshCw, FileText, Code, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
    content: UIContent;
    onRefine?: (comments: string) => void;
    onReset?: () => void;
}

export const FinalOutput: React.FC<Props> = ({ content, onRefine, onReset }) => {
    const [activeTab, setActiveTab] = useState<'spec' | 'prompt' | 'guides' | 'agents'>('spec');
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

    const tabs = [
        { id: 'spec', label: 'Specification', icon: FileText },
        { id: 'prompt', label: 'AI Mega-Prompt', icon: Code },
        { id: 'agents', label: 'Agent Plan', icon: FileText },
        { id: 'guides', label: 'Integration Guides', icon: BookOpen },
    ] as const;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmos-primary to-cosmos-secondary">
                    {content.project_name || "Project Blueprint"}
                </h2>
                <p className="text-xl text-cosmos-muted">{content.app_tagline}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-cosmos-border">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 font-medium transition-all relative",
                            activeTab === tab.id
                                ? "text-cosmos-primary"
                                : "text-cosmos-muted hover:text-cosmos-text"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cosmos-primary" />
                        )}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'spec' && (
                    <div className="space-y-6">
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-4 text-cosmos-secondary">Core Features</h3>
                            <ul className="space-y-2">
                                {content.features_list?.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-cosmos-text">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cosmos-primary flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>

                        <GlassCard>
                            <h3 className="text-xl font-bold mb-4 text-cosmos-secondary">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {content.tech_stack_recommendation?.map((t, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-cosmos-surface border border-cosmos-border text-sm text-cosmos-muted">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                )}

                {activeTab === 'prompt' && (
                    <div className="relative group">
                        <div className="bg-[#0B1120] p-6 rounded-xl border border-cosmos-border overflow-hidden">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {content.mega_prompt}
                            </pre>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GlowingButton onClick={copyToClipboard} className="text-xs px-4 py-2">
                                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                {copied ? 'Copied!' : 'Copy Prompt'}
                            </GlowingButton>
                        </div>
                        <p className="mt-4 text-center text-sm text-cosmos-muted">
                            Paste this prompt into your AI coding assistant (Cursor, Windsurf, etc.) to build the app.
                        </p>
                    </div>
                )}

                {activeTab === 'agents' && (
                    <div className="relative group">
                        <div className="bg-[#0B1120] p-6 rounded-xl border border-cosmos-border overflow-hidden">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {content.agents_md || "No agent plan generated."}
                            </pre>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GlowingButton onClick={() => {
                                navigator.clipboard.writeText(content.agents_md || "");
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }} className="text-xs px-4 py-2">
                                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                {copied ? 'Copied!' : 'Copy Plan'}
                            </GlowingButton>
                        </div>
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div className="space-y-4">
                        {content.manual_guides && content.manual_guides.length > 0 ? (
                            content.manual_guides.map((guide, i) => (
                                <GlassCard key={i}>
                                    <h3 className="text-lg font-bold text-cosmos-primary mb-3">{guide.title}</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-cosmos-muted">
                                        {guide.steps.map((step, j) => (
                                            <li key={j}>{step}</li>
                                        ))}
                                    </ol>
                                </GlassCard>
                            ))
                        ) : (
                            <div className="text-center text-cosmos-muted py-10">
                                No manual integrations required for this project.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Refine Section */}
            <div className="pt-8 border-t border-cosmos-border space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <RefreshCw size={18} className="text-cosmos-primary" />
                    Refine & Iteration
                </h3>

                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <textarea
                            value={refineText}
                            onChange={(e) => setRefineText(e.target.value)}
                            placeholder="E.g. Change the database to PostgreSQL, or add a dark mode feature..."
                            rows={3}
                            className="w-full bg-cosmos-bg/50 border border-cosmos-border rounded-lg p-4 text-white placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-primary transition-colors resize-none"
                        />
                        <div className="absolute bottom-3 right-3">
                            <GlowingButton
                                onClick={handleRefine}
                                disabled={isRefining || !refineText.trim()}
                                className="px-4 py-1 text-sm h-8"
                            >
                                {isRefining ? 'Updating...' : 'Finetune'}
                            </GlowingButton>
                        </div>
                    </div>

                    <div className="flex flex-col justify-end">
                        <div className="h-[1px] w-full bg-cosmos-border my-4 md:hidden" />
                        <button
                            onClick={onReset}
                            className="text-cosmos-muted hover:text-white text-sm flex items-center gap-1 transition-colors px-4 py-2"
                        >
                            Start New Project <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
