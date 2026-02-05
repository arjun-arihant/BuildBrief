import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className,
  size = 'md' 
}) => {
  const { theme, setTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const options: { value: typeof theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  const cycleTheme = () => {
    const currentIndex = options.findIndex(o => o.value === theme);
    const nextIndex = (currentIndex + 1) % options.length;
    setTheme(options[nextIndex].value);
  };

  const CurrentIcon = options.find(o => o.value === theme)?.icon || Sun;

  return (
    <motion.button
      onClick={cycleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative rounded-xl flex items-center justify-center',
        'bg-aurora-surface/80 backdrop-blur-xl',
        'border border-aurora-border/50',
        'text-aurora-muted hover:text-aurora-text',
        'transition-colors duration-200',
        sizeClasses[size],
        className
      )}
      title={`Theme: ${theme} (click to cycle)`}
    >
      <CurrentIcon size={iconSizes[size]} />
      
      {/* Active indicator dot */}
      <motion.div
        layoutId="theme-indicator"
        className={cn(
          'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-aurora-primary'
        )}
      />
    </motion.button>
  );
};

// Dropdown version for more explicit control
export const ThemeToggleDropdown: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  const CurrentIcon = options.find(o => o.value === theme)?.icon || Sun;

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          'bg-aurora-surface/80 backdrop-blur-xl',
          'border border-aurora-border/50',
          'text-aurora-muted hover:text-aurora-text',
          'transition-all duration-200'
        )}
      >
        <CurrentIcon size={16} />
        <span className="text-sm font-medium capitalize">{theme}</span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute right-0 mt-2 w-40 py-2 rounded-xl z-50',
            'bg-aurora-surface/95 backdrop-blur-xl',
            'border border-aurora-border/50',
            'shadow-card'
          )}
        >
          {options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              whileHover={{ x: 4 }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-left',
                'text-sm transition-colors',
                theme === option.value
                  ? 'text-aurora-primary bg-aurora-primary/10'
                  : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-surfaceHover'
              )}
            >
              <option.icon size={16} />
              <span className="capitalize">{option.label}</span>
              {theme === option.value && (
                <motion.div
                  layoutId="active-theme"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-aurora-primary"
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
