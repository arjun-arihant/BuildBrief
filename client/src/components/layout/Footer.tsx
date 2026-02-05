import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Twitter, Github, Linkedin, Mail,
  ArrowUpRight, Heart 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Roadmap', href: '/roadmap' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Guides', href: '/guides' },
    { name: 'Examples', href: '/examples' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/buildbrief', icon: Twitter },
  { name: 'GitHub', href: 'https://github.com/arjun-arihant/buildbrief', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/buildbrief', icon: Linkedin },
  { name: 'Email', href: 'mailto:hello@buildbrief.com', icon: Mail },
];

export function Footer() {
  return (
    <footer className="relative border-t border-aurora-border/30 bg-aurora-bg">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-aurora-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aurora-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-aurora-primary to-aurora-secondary'
              )}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-aurora-text">
                BuildBrief
              </span>
            </Link>
            
            <p className="text-aurora-muted text-sm leading-relaxed mb-6 max-w-xs">
              Transform your ideas into production-ready architecture specifications 
              with AI-powered precision.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-aurora-surface border border-aurora-border/50',
                    'text-aurora-muted hover:text-aurora-text',
                    'hover:border-aurora-primary/30 transition-all duration-200'
                  )}
                  title={social.name}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-aurora-text font-semibold mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        'group flex items-center gap-1 text-sm',
                        'text-aurora-muted hover:text-aurora-text',
                        'transition-colors duration-200'
                      )}
                    >
                      {link.name}
                      <ArrowUpRight 
                        size={12} 
                        className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" 
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-aurora-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-aurora-muted text-sm">
              © {new Date().getFullYear()} BuildBrief. Made with{' '}
              <Heart size={14} className="inline text-aurora-error" />{' '}
              for builders.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-aurora-muted hover:text-aurora-text text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-aurora-muted hover:text-aurora-text text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-aurora-muted hover:text-aurora-text text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
