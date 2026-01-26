import React, { useState } from 'react';
import { UIContent } from '../../types';
import { GlowingButton } from '../ui/GlowingButton';
import { CheckSquare, Square, ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
    content: UIContent;
    onSubmit: (answer: string) => void;
}

export const ManualAction: React.FC<Props> = ({ content, onSubmit }) => {
    const [done, setDone] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle size={24} />
                <h3 className="text-xl font-bold">Action Required</h3>
            </div>

            <h3 className="text-2xl font-bold text-cosmos-text">{content.question_text || content.action_title}</h3>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-yellow-100/90 leading-relaxed">
                {content.explanation || content.action_description}
            </div>

            <div
                onClick={() => setDone(!done)}
                className="flex items-center gap-3 cursor-pointer group"
            >
                <div className={cn(
                    "w-6 h-6 flex items-center justify-center rounded transition-colors",
                    done ? "text-yellow-400" : "text-cosmos-muted group-hover:text-cosmos-text"
                )}>
                    {done ? <CheckSquare size={24} /> : <Square size={24} />}
                </div>
                <span className={cn(
                    "font-medium transition-colors",
                    done ? "text-yellow-400" : "text-cosmos-muted group-hover:text-cosmos-text"
                )}>
                    I have completed this step
                </span>
            </div>

            <div className="flex justify-end">
                <GlowingButton
                    onClick={() => onSubmit("Action Completed")}
                    disabled={!done}
                    className={done ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20 text-black" : ""}
                >
                    Continue <ArrowRight size={18} />
                </GlowingButton>
            </div>
        </div>
    );
};
