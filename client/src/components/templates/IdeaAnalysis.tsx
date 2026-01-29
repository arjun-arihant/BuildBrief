import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GlowingButton } from '../ui/GlowingButton';
import { UIContent } from '../../types';
import {
    Sparkles, Lightbulb, AlertTriangle, Rocket,
    ChevronRight, Target, Zap, MessageSquare
} from 'lucide-react';

interface IdeaAnalysisProps {
    content: UIContent;
    onContinue: () => void;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const TypewriterText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const [displayText, setDisplayText] = React.useState('');

    React.useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 20);
        return () => clearInterval(timer);
    }, [text]);

    return <span className={className}>{displayText}</span>;
};

export const IdeaAnalysis: React.FC<IdeaAnalysisProps> = ({ content, onContinue }) => {
    // Extract with defaults for optional fields
    const appName = content.app_name_suggestion || 'Your App';
    const visionStatement = content.vision_statement || 'A great idea that we will help you bring to life.';
    const approaches = content.implementation_approaches || [];
    const caution = content.caution || { type: 'scope' as const, message: 'Consider starting with a focused MVP.' };
    const journey = content.journey_preview || ['Define your users', 'Choose features', 'Get your spec'];

    const cautionIcons = {
        market: Target,
        technical: Zap,
        scope: AlertTriangle,
        competition: MessageSquare,
    };
    const CautionIcon = cautionIcons[caution.type] || AlertTriangle;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto space-y-6 pb-20"
        >
            {/* Hero Section */}
            <motion.div variants={item} className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aurora-primary/10 border border-aurora-primary/30 mb-4"
                >
                    <Sparkles className="text-aurora-secondary" size={18} />
                    <span className="text-aurora-secondary font-medium">I love this idea!</span>
                </motion.div>

                <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                    <span className="aurora-gradient-text">{appName}</span>
                </h1>
            </motion.div>

            {/* Vision Statement Card */}
            <motion.div variants={item}>
                <GlassCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-primary/10 rounded-full blur-3xl" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-aurora-primary/20 flex items-center justify-center">
                                <Lightbulb className="text-aurora-primary" size={20} />
                            </div>
                            <h2 className="text-lg font-semibold text-aurora-text">Your Vision</h2>
                        </div>
                        <p className="text-aurora-muted leading-relaxed text-lg">
                            <TypewriterText text={visionStatement} />
                        </p>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Implementation Approaches */}
            {approaches.length > 0 && (
                <motion.div variants={item}>
                    <h3 className="text-aurora-muted text-sm font-medium uppercase tracking-wider mb-4 px-1">
                        This could be built as...
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {approaches.map((approach, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <GlassCard hover className="h-full">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aurora-primary to-aurora-accent flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold text-sm">{index + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-aurora-text mb-1">{approach.title}</h4>
                                            <p className="text-sm text-aurora-muted">{approach.description}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Words of Caution */}
            <motion.div variants={item}>
                <GlassCard className="border-aurora-warning/30 bg-aurora-warning/5">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-aurora-warning/20 flex items-center justify-center flex-shrink-0">
                            <CautionIcon className="text-aurora-warning" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-aurora-text mb-1">A Word of Caution</h3>
                            <p className="text-sm text-aurora-muted">{caution.message}</p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Journey Preview */}
            <motion.div variants={item}>
                <GlassCard glow>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-aurora-success/20 flex items-center justify-center">
                            <Rocket className="text-aurora-success" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-aurora-text">Your Journey Starts Here</h3>
                            <p className="text-sm text-aurora-muted">Here's how we'll refine your idea together</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {journey.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-aurora-primary/20 flex items-center justify-center border border-aurora-primary/40">
                                        <span className="text-aurora-primary font-bold text-sm">{index + 1}</span>
                                    </div>
                                    {index < journey.length - 1 && (
                                        <div className="absolute top-8 left-1/2 w-0.5 h-4 bg-aurora-border -translate-x-1/2" />
                                    )}
                                </div>
                                <span className="text-aurora-text">{step}</span>
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>
            </motion.div>

            {/* CTA Button */}
            <motion.div
                variants={item}
                className="flex justify-center pt-4"
            >
                <GlowingButton
                    size="lg"
                    onClick={onContinue}
                    icon={<ChevronRight size={20} />}
                    iconPosition="right"
                    className="min-w-[200px]"
                >
                    Let's Begin
                </GlowingButton>
            </motion.div>
        </motion.div>
    );
};
