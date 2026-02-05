import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sparkles, ChevronRight, Zap, Shield, Users 
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Features', href: '/features', icon: Zap },
  { name: 'Pricing', href: '/pricing', icon: Shield },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Blog', href: '/blog', icon: Sparkles },
  { name: 'Contact', href: '/contact', icon: ChevronRight },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-aurora-bg/80 backdrop-blur-xl border-b border-aurora-border/30'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  'bg-gradient-to-br from-aurora-primary to-aurora-secondary',
                  'shadow-lg shadow-aurora-primary/25'
                )}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-display font-bold text-aurora-text">
                BuildBrief
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    location.pathname === link.href
                      ? 'text-aurora-text'
                      : 'text-aurora-muted hover:text-aurora-text'
                  )}
                >
                  {location.pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-aurora-surface rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle size="md" />
              
              <Link
                to="/app"
                className={cn(
                  'hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl',
                  'bg-aurora-primary text-white font-medium',
                  'shadow-lg shadow-aurora-primary/25',
                  'hover:bg-aurora-primaryHover hover:shadow-aurora-primary/40',
                  'transition-all duration-200'
                )}
              >
                <span>Get Started</span>
                <ChevronRight size={16} />
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden w-10 h-10 rounded-xl flex items-center justify-center',
                  'bg-aurora-surface/80 backdrop-blur-xl',
                  'border border-aurora-border/50',
                  'text-aurora-text'
                )}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed top-0 right-0 bottom-0 w-72 z-50 lg:hidden',
                'bg-aurora-bg/95 backdrop-blur-xl',
                'border-l border-aurora-border/30',
                'p-6 pt-20'
              )}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl',
                        'text-base font-medium transition-all duration-200',
                        location.pathname === link.href
                          ? 'bg-aurora-primary/10 text-aurora-primary'
                          : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-surface'
                      )}
                    >
                      <link.icon size={20} />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="mt-4 pt-4 border-t border-aurora-border/30"
                >
                  <Link
                    to="/app"
                    className={cn(
                      'flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl',
                      'bg-aurora-primary text-white font-medium',
                      'shadow-lg shadow-aurora-primary/25'
                    )}
                  >
                    <span>Get Started</span>
                    <ChevronRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
