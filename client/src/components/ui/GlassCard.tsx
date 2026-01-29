import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    hover = false,
    glow = false,
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={cn(
                // Base styles
                'relative p-6 rounded-2xl',
                'bg-aurora-surface/80 backdrop-blur-xl',
                'border border-aurora-border/50',
                // Shadow
                'shadow-card',
                // Inner light effect
                '[box-shadow:inset_0_1px_0_rgba(255,255,255,0.05)]',
                // Hover styles
                hover && [
                    'cursor-pointer transition-all duration-300',
                    'hover:bg-aurora-surfaceHover/80',
                    'hover:border-aurora-primary/30',
                    'hover:-translate-y-0.5',
                    'hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.1)]',
                ],
                // Glow effect
                glow && 'animate-glow-pulse',
                className
            )}
            {...props}
        >
            {/* Optional decorative gradient */}
            {glow && (
                <div className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none bg-gradient-to-br from-aurora-primary/20 via-transparent to-aurora-secondary/10" />
            )}
            {children}
        </motion.div>
    );
};
