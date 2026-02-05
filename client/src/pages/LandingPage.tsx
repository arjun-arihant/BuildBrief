import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Zap, Shield, Users, Workflow,
  Star, CheckCircle2, Play
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { Input } from '../components/ui/Input';
import { SEO } from '../components/seo/SEO';
import { cn } from '../lib/utils';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Interviews',
    description: 'Our AI acts as a senior product manager, asking intelligent questions to clarify your vision.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Workflow,
    title: 'Smart Decision Making',
    description: 'Automatically decides technical details so you can focus on what matters most.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Production-Ready Specs',
    description: 'Generate Mega-Prompts ready for Cursor, Windsurf, Bolt, and other AI coding agents.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share specifications with your team and collaborate in real-time.',
    color: 'from-emerald-500 to-teal-600',
  },
];

const steps = [
  {
    number: '01',
    title: 'Share Your Idea',
    description: 'Describe your project in plain English. No technical jargon required.',
  },
  {
    number: '02',
    title: 'AI Interview',
    description: 'Our AI asks clarifying questions to understand your requirements deeply.',
  },
  {
    number: '03',
    title: 'Get Your Spec',
    description: 'Receive a comprehensive specification document ready for development.',
  },
  {
    number: '04',
    title: 'Build Faster',
    description: 'Use the Mega-Prompt with your favorite AI coding agent to build instantly.',
  },
];

const testimonials = [
  {
    quote: "BuildBrief turned my vague app idea into a detailed spec in 20 minutes. What would have taken weeks of back-and-forth with developers.",
    author: "Sarah Chen",
    role: "Founder, TechStart",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "The AI asked questions I hadn't even considered. Saved us from making costly architectural mistakes early on.",
    author: "Marcus Johnson",
    role: "CTO, DataFlow Inc",
    avatar: "MJ",
    rating: 5,
  },
  {
    quote: "As a non-technical founder, BuildBrief gave me the confidence to communicate my vision clearly to developers.",
    author: "Emma Williams",
    role: "CEO, GreenLeaf",
    avatar: "EW",
    rating: 5,
  },
];

const stats = [
  { value: '10K+', label: 'Specs Generated' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '50+', label: 'Countries' },
  { value: '24/7', label: 'AI Available' },
];

export function LandingPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate('/app', { state: { email } });
    }
  };

  return (
    <>
      <SEO />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-aurora-primary/10 border border-aurora-primary/30 mb-8"
          >
            <Sparkles size={16} className="text-aurora-primary" />
            <span className="text-sm font-medium text-aurora-primary">
              Now with enhanced AI capabilities
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6"
          >
            From{' '}
            <span className="aurora-gradient-text">Idea</span>
            {' '}to{' '}
            <span className="text-aurora-primary">Production Spec</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-aurora-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            BuildBrief acts as your AI product manager, interviewing you to generate 
            production-ready architecture specifications and Mega-Prompts for AI coding agents.
          </motion.p>

          {/* CTA Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto mb-8"
          >
            <div className="relative w-full">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to get started"
                className="h-14 pl-5 pr-4 text-base w-full"
                containerClassName="w-full"
              />
            </div>
            <GlowingButton 
              type="submit"
              size="lg"
              className="w-full sm:w-auto whitespace-nowrap"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
            >
              Start Building
            </GlowingButton>
          </motion.form>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-aurora-muted"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-aurora-success" />
              Free to start
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-aurora-success" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-aurora-success" />
              Cancel anytime
            </span>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-aurora-border/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-aurora-bg via-transparent to-transparent z-10" />
              <img
                src="/demo-preview.jpg"
                alt="BuildBrief Interface Preview"
                className="w-full h-auto opacity-80"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {/* Placeholder if no image */}
              <div className="aspect-video bg-aurora-surface/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-aurora-primary to-aurora-secondary mx-auto mb-4 flex items-center justify-center">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                  <p className="text-aurora-muted">See BuildBrief in action</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-y border-aurora-border/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-display font-bold text-aurora-text mb-2">
                  {stat.value}
                </div>
                <div className="text-aurora-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-aurora-secondary/10 
                            text-aurora-secondary text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Everything you need to{' '}
              <span className="aurora-gradient-text">specify</span>
            </h2>
            <p className="text-aurora-muted text-lg max-w-2xl mx-auto">
              Powerful features designed to help you transform ideas into 
              production-ready specifications.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover className="h-full">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    'bg-gradient-to-br',
                    feature.color
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-aurora-muted">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4 bg-aurora-surface/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-aurora-accent/10 
                            text-aurora-accent text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Four simple steps to{' '}
              <span className="text-aurora-primary">success</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-display font-bold text-aurora-border/50 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-aurora-muted">{step.description}</p>

                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="text-aurora-border/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-aurora-primary/10 
                            text-aurora-primary text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Loved by{' '}
              <span className="aurora-gradient-text">builders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-aurora-secondary text-aurora-secondary" />
                    ))}
                  </div>
                  
                  <blockquote className="text-aurora-text mb-6 flex-1">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-primary to-aurora-secondary 
                                    flex items-center justify-center text-white text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-aurora-muted">{testimonial.role}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-aurora-primary/20 via-aurora-surface to-aurora-secondary/10" />
            <div className="relative p-12 lg:p-16 text-center">
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
                Ready to build something{' '}
                <span className="aurora-gradient-text">amazing</span>?
              </h2>
              
              <p className="text-aurora-muted text-lg max-w-xl mx-auto mb-8">
                Join thousands of builders who use BuildBrief to transform their ideas 
                into production-ready specifications.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/app">
                  <GlowingButton size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                    Get Started Free
                  </GlowingButton>
                </Link>
                <Link to="/pricing">
                  <GlowingButton variant="secondary" size="lg">
                    View Pricing
                  </GlowingButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
