import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowingButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
}

export function GlowingButton({ children, variant = 'primary', className, ...props }: GlowingButtonProps) {
    const variants = {
        primary: "bg-cosmos-primary text-white shadow-lg shadow-cosmos-primary/30 hover:shadow-cosmos-primary/50",
        secondary: "bg-cosmos-secondary/10 text-cosmos-secondary border border-cosmos-secondary/50 hover:bg-cosmos-secondary/20",
        ghost: "bg-transparent text-cosmos-muted hover:text-white hover:bg-white/5",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
