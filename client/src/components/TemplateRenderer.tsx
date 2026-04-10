import React from 'react';
import { AIResponse } from '../types';
import { FreeText } from './templates/FreeText';
import { Choice } from './templates/Choice';
import { ManualAction } from './templates/ManualAction';
import { Explanation } from './templates/Explanation';
import { FinalOutput } from './templates/FinalOutput';
import { IdeaAnalysis } from './templates/IdeaAnalysis';
import { GlassCard } from './ui/GlassCard';
import { AutoDecisionsSidebar } from './ui/AutoDecisionsSidebar';

interface Props {
    step: AIResponse;
    onSubmit: (answer: string) => void;
    onRefine?: (comments: string) => void;
    onReset?: () => void;
    loading: boolean;
    allDecisions?: Array<{ decision: string; reason: string }>;
    projectId?: string;
}

export const TemplateRenderer: React.FC<Props> = ({ step, onSubmit, onRefine, onReset, loading, allDecisions, projectId }) => {
    const { template, content } = step;
    const autoDecisions = allDecisions || content.auto_decisions || [];

    // IdeaAnalysis template has its own layout (no GlassCard wrapper)
    if (template === 'idea_analysis') {
        return (
            <>
                <AutoDecisionsSidebar decisions={autoDecisions} newDecisions={content.auto_decisions || []} />
                <IdeaAnalysis
                    content={content}
                    onContinue={() => onSubmit('continue')}
                />
            </>
        );
    }

    return (
        <>
            {/* Auto-Decisions Sidebar (right side) */}
            <AutoDecisionsSidebar decisions={autoDecisions} newDecisions={content.auto_decisions || []} />

            <div className="w-full max-w-3xl mx-auto pb-20">
                <GlassCard className="p-8 md:p-10 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-aurora-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                    {(() => {
                        switch (template) {
                            case 'free_text':
                                return <FreeText content={content} onSubmit={onSubmit} loading={loading} />;
                            case 'single_choice':
                            case 'multi_choice':
                                return <Choice content={content} type={template} onSubmit={onSubmit} loading={loading} />;
                            case 'manual_action':
                                return <ManualAction content={content} onSubmit={onSubmit} loading={loading} />;
                            case 'explanation_only':
                                return <Explanation content={content} onSubmit={onSubmit} loading={loading} />;
                            case 'summary':
                            case 'final_output':
                                return <FinalOutput content={content} onRefine={onRefine} onReset={onReset} loading={loading} projectId={projectId} />;
                            default:
                                return <div>Unknown template: {template}</div>;
                        }
                    })()}
                </GlassCard>
            </div>
        </>
    );
};
