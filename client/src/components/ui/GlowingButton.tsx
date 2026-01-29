import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowingButtonProps {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    className,
    disabled,
    onClick,
    type = 'button',
}) => {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-xl',
    };

    const variantClasses = {
        primary: cn(
            'bg-aurora-primary text-white font-medium',
            'shadow-[0_4px_14px_rgba(139,92,246,0.3)]',
            'hover:bg-aurora-primaryHover hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)]',
            'active:scale-[0.98] active:shadow-[0_2px_10px_rgba(139,92,246,0.3)]'
        ),
        secondary: cn(
            'bg-aurora-surface text-aurora-text font-medium',
            'border border-aurora-border',
            'hover:bg-aurora-surfaceHover hover:border-aurora-primary/30',
            'active:scale-[0.98]'
        ),
        ghost: cn(
            'bg-transparent text-aurora-muted font-medium',
            'hover:text-aurora-text hover:bg-aurora-surface/50',
            'active:scale-[0.98]'
        ),
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                'relative inline-flex items-center justify-center gap-2',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
        >
            {/* Loading spinner */}
            {loading && (
                <svg
                    className="absolute animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}

            {/* Content */}
            <span className={cn('flex items-center gap-2', loading && 'invisible')}>
                {icon && iconPosition === 'left' && icon}
                {children}
                {icon && iconPosition === 'right' && icon}
            </span>
        </motion.button>
    );
};
