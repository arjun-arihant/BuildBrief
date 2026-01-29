import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { GlassCard } from './GlassCard';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function Input({ label, error, className, containerClassName, ...props }: InputProps) {
    return (
        <div className={cn("space-y-2", containerClassName)}>
            {label && <label className="text-sm font-medium text-cosmos-muted ml-1">{label}</label>}
            <GlassCard className="p-0 overflow-hidden relative group">
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-cosmos-primary w-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileFocus={{ scaleX: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <input
                    className={cn(
                        "w-full bg-transparent px-4 py-3 text-cosmos-text placeholder:text-white/20 focus:outline-none transition-colors",
                        className
                    )}
                    {...props}
                />
            </GlassCard>
            {error && <p className="text-red-400 text-xs ml-1 animate-pulse">{error}</p>}
        </div>
    );
}
