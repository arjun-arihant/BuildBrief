import { motion } from 'framer-motion';
import { 
  Brain, FileText, Code, Users, Shield, Clock, 
  Layers, Sparkles, Target, Workflow, Globe, Check, ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { SEO } from '../components/seo/SEO';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const mainFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Interviews',
    description: 'Our intelligent AI acts as a senior product manager, conducting structured interviews to understand your project requirements deeply.',
    benefits: [
      'Adaptive questioning based on your responses',
      'Identifies edge cases and potential issues early',
      'Clarifies ambiguous requirements automatically',
      'Learns from thousands of successful projects'
    ],
    color: 'from-violet-500 to-purple-600',
    image: 'interview-visual'
  },
  {
    icon: Target,
    title: 'Smart Decision Making',
    description: 'BuildBrief automatically makes intelligent technical decisions, freeing you to focus on the creative aspects of your project.',
    benefits: [
      'Auto-selects optimal tech stack based on requirements',
      'Recommends architecture patterns',
      'Suggests third-party integrations',
      'Estimates complexity and timeline'
    ],
    color: 'from-amber-500 to-orange-600',
    image: 'decisions-visual'
  },
  {
    icon: FileText,
    title: 'Mega-Prompt Generation',
    description: 'Generate comprehensive specifications that work seamlessly with Cursor, Windsurf, Bolt, and other AI coding agents.',
    benefits: [
      'Structured for maximum AI comprehension',
      'Includes context, requirements, and constraints',
      'Ready to copy-paste into your favorite tool',
      'Optimized for different agent capabilities'
    ],
    color: 'from-cyan-500 to-blue-600',
    image: 'prompt-visual'
  }
];

const additionalFeatures = [
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members to review and contribute to specifications in real-time.',
  },
  {
    icon: Layers,
    title: 'Version Control',
    description: 'Track changes and maintain history of your project specifications over time.',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Enterprise-grade security with end-to-end encryption for your project data.',
  },
  {
    icon: Clock,
    title: 'Time Saving',
    description: 'Reduce specification time from weeks to hours with AI assistance.',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Generate specifications in multiple programming languages and frameworks.',
  },
  {
    icon: Workflow,
    title: 'Export Options',
    description: 'Export as Markdown, PDF, or structured JSON for various use cases.',
  },
];

const integrations = [
  { name: 'Cursor', category: 'Editor' },
  { name: 'Windsurf', category: 'Editor' },
  { name: 'Bolt', category: 'Platform' },
  { name: 'GitHub Copilot', category: 'Assistant' },
  { name: 'Claude', category: 'AI' },
  { name: 'GPT-4', category: 'AI' },
  { name: 'Notion', category: 'Docs' },
  { name: 'Confluence', category: 'Docs' },
];

const FeatureVisual = ({ type, color }: { type: string; color: string }) => {
  return (
    <div className={cn(
      'w-full h-64 rounded-2xl bg-gradient-to-br flex items-center justify-center',
      color
    )}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl mx-auto mb-4 flex items-center justify-center">
          {type === 'interview-visual' && <Brain size={40} className="text-white" />}
          {type === 'decisions-visual' && <Target size={40} className="text-white" />}
          {type === 'prompt-visual' && <FileText size={40} className="text-white" />}
        </div>
        <p className="text-white/80 font-medium">Visual Preview</p>
      </div>
    </div>
  );
};

export function FeaturesPage() {
  return (
    <>
      <SEO 
        title="Features"
        description="Discover how BuildBrief transforms your ideas into production-ready specifications with AI-powered interviews, smart decisions, and Mega-Prompt generation."
        keywords={['AI features', 'specification generator', 'Mega-Prompt', 'AI interview', 'product management AI']}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aurora-primary/10 border border-aurora-primary/30 mb-6">
              <Sparkles size={16} className="text-aurora-primary" />
              <span className="text-sm font-medium text-aurora-primary">Powerful Features</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              Everything you need to{' '}
              <span className="aurora-gradient-text">specify</span>
            </h1>

            <p className="text-xl text-aurora-muted max-w-2xl mx-auto">
              From intelligent interviews to production-ready outputs, BuildBrief provides 
              all the tools you need to transform ideas into reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-32">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={cn(
                'grid lg:grid-cols-2 gap-12 items-center',
                index % 2 === 1 && 'lg:flex-row-reverse'
              )}
            >
              <div className={cn(index % 2 === 1 && 'lg:order-2')}>
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                  'bg-gradient-to-br',
                  feature.color
                )}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                  {feature.title}
                </h2>

                <p className="text-aurora-muted text-lg mb-8">
                  {feature.description}
                </p>

                <ul className="space-y-4">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        'bg-gradient-to-br',
                        feature.color
                      )}>
                        <Check size={14} className="text-white" />
                      </div>
                      <span className="text-aurora-text">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={cn(index % 2 === 1 && 'lg:order-1')}>
                <FeatureVisual type={feature.image} color={feature.color} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4 bg-aurora-surface/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              And there is more
            </h2>
            <p className="text-aurora-muted">
              Additional features to supercharge your workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover className="h-full">
                  <feature.icon className="w-10 h-10 text-aurora-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-aurora-muted">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Works with your{' '}
              <span className="aurora-gradient-text">favorite tools</span>
            </h2>
            <p className="text-aurora-muted">
              Seamlessly integrate with the tools you already use
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {integrations.map((integration, i) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard 
                  hover 
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-aurora-surface mb-3 flex items-center justify-center">
                    <Code size={24} className="text-aurora-primary" />
                  </div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-xs text-aurora-muted">{integration.category}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Ready to experience the{' '}
              <span className="aurora-gradient-text">difference</span>?
            </h2>

            <p className="text-aurora-muted text-lg mb-8">
              Start generating professional specifications today. 
              No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app">
                <GlowingButton size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                  Start Free Trial
                </GlowingButton>
              </Link>
              <Link to="/pricing">
                <GlowingButton variant="secondary" size="lg">
                  View Pricing
                </GlowingButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}