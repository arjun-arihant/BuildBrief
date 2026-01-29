import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function Input({ label, error, className, containerClassName, ...props }: InputProps) {
    return (
        <div className={cn("space-y-2", containerClassName)}>
            {label && <label className="text-sm font-medium text-aurora-muted ml-1">{label}</label>}
            <div className="relative group">
                <input
                    className={cn(
                        "w-full px-4 py-3 rounded-xl",
                        "bg-aurora-surface/60 backdrop-blur-sm",
                        "border border-aurora-border/50",
                        "text-aurora-text placeholder:text-aurora-muted/50",
                        "focus:outline-none focus:border-aurora-primary/50 focus:ring-2 focus:ring-aurora-primary/20",
                        "transition-all duration-200",
                        className
                    )}
                    {...props}
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-aurora-primary to-aurora-accent rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileFocus={{ scaleX: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ transformOrigin: 'left' }}
                />
            </div>
            {error && <p className="text-aurora-error text-xs ml-1 animate-pulse">{error}</p>}
        </div>
    );
}
