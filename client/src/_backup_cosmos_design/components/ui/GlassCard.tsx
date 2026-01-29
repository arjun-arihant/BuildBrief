import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, y: -4 } : undefined}
            className={cn(
                "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6",
                "shadow-lg shadow-black/10",
                hoverEffect && "cursor-pointer transition-all duration-300 hover:border-cosmos-primary/30 hover:shadow-cosmos-primary/20",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
