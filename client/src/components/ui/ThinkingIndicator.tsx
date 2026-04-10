import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
    'Analyzing your answer...',
    'Making smart decisions...',
    'Crafting the next question...',
    'Processing your input...',
    'Building your spec...',
];

interface Props {
    message?: string;
}

export const ThinkingIndicator: React.FC<Props> = ({ message }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % MESSAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-8"
        >
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-aurora-surface/80 backdrop-blur-xl border border-aurora-border/50 shadow-card">
                {/* Pulsing dots */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-aurora-primary"
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                {/* Sparkle icon */}
                <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Sparkles size={16} className="text-aurora-primary" />
                </motion.div>

                {/* Rotating message */}
                <motion.span
                    key={message || messageIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-aurora-muted"
                >
                    {message || MESSAGES[messageIndex]}
                </motion.span>
            </div>
        </motion.div>
    );
};
