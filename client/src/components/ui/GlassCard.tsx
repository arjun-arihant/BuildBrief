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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "glass rounded-xl p-6",
                hoverEffect && "hover:bg-cosmos-card/80 transition-colors duration-300 cursor-pointer hover:shadow-cosmos-primary/20 hover:shadow-xl",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
