import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, X, Sparkles, Zap, Users, Crown, HelpCircle,
  ArrowRight, Shield, Clock, Infinity
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { PricingSEO } from '../components/seo/SEO';
import { cn } from '../lib/utils';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started and small projects',
    price: { monthly: 0, yearly: 0 },
    icon: Zap,
    popular: false,
    features: [
      { text: 'Up to 3 projects', included: true },
      { text: 'Basic AI interviews', included: true },
      { text: 'Standard Mega-Prompts', included: true },
      { text: 'Export to Markdown', included: true },
      { text: 'Community support', included: true },
      { text: 'Priority AI processing', included: false },
      { text: 'Team collaboration', included: false },
      { text: 'Custom templates', included: false },
      { text: 'API access', included: false },
      { text: 'Advanced analytics', included: false },
    ],
    cta: 'Get Started Free',
    ctaVariant: 'secondary' as const,
  },
  {
    name: 'Pro',
    description: 'For serious builders who need unlimited power',
    price: { monthly: 19, yearly: 15 },
    icon: Crown,
    popular: true,
    badge: 'Most Popular',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: 'Advanced AI interviews', included: true },
      { text: 'Enhanced Mega-Prompts', included: true },
      { text: 'Export to Markdown, PDF, JSON', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Priority AI processing', included: true },
      { text: 'Team collaboration (up to 3)', included: true },
      { text: 'Custom templates', included: true },
      { text: 'API access', included: false },
      { text: 'Advanced analytics', included: false },
    ],
    cta: 'Start Pro Trial',
    ctaVariant: 'primary' as const,
  },
  {
    name: 'Team',
    description: 'For teams building together at scale',
    price: { monthly: 49, yearly: 39 },
    icon: Users,
    popular: false,
    badge: 'Best Value',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: 'Advanced AI interviews', included: true },
      { text: 'Enhanced Mega-Prompts', included: true },
      { text: 'Export to all formats', included: true },
      { text: '24/7 priority support', included: true },
      { text: 'Fastest AI processing', included: true },
      { text: 'Unlimited team members', included: true },
      { text: 'Custom templates', included: true },
      { text: 'Full API access', included: true },
      { text: 'Advanced analytics', included: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'secondary' as const,
  },
];

const faqs = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! Both Pro and Team plans come with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial and won\'t be charged.'
  },
  {
    question: 'What happens to my projects if I downgrade?',
    answer: 'Your projects remain accessible, but you\'ll be limited by the plan constraints (e.g., number of active projects). You can always export your data before making changes.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 30 days for a full refund, no questions asked.'
  },
  {
    question: 'Can I get a custom enterprise plan?',
    answer: 'Absolutely! For organizations with specific needs, we offer custom enterprise plans with dedicated support, SLA guarantees, and custom integrations. Contact our sales team.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Team plans. All payments are securely processed via Stripe.'
  },
];

const testimonials = [
  {
    quote: "The Pro plan paid for itself in the first week. The time savings alone are worth 10x the price.",
    author: "David Park",
    role: "Tech Lead, StartupX"
  },
  {
    quote: "We switched to the Team plan and it's been transformational for our product development process.",
    author: "Lisa Chen",
    role: "Product Manager, ScaleUp Inc"
  }
];

function PricingCard({ 
  plan, 
  isYearly 
}: { 
  plan: typeof plans[0]; 
  isYearly: boolean;
}) {
  const price = isYearly ? plan.price.yearly : plan.price.monthly;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'relative rounded-3xl overflow-hidden',
        plan.popular && 'ring-2 ring-aurora-primary shadow-glow'
      )}
    >
      {plan.badge && (
        <div className={cn(
          'absolute top-0 right-0 px-4 py-1 text-xs font-medium text-white',
          plan.popular ? 'bg-aurora-primary' : 'bg-aurora-secondary'
        )}>
          {plan.badge}
        </div>
      )}

      <GlassCard className="h-full flex flex-col">
        <div className="mb-6">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            plan.popular 
              ? 'bg-gradient-to-br from-aurora-primary to-aurora-secondary'
              : 'bg-aurora-surface'
          )}>
            <plan.icon className={cn(
              'w-6 h-6',
              plan.popular ? 'text-white' : 'text-aurora-primary'
            )} />
          </div>

          <h3 className="text-2xl font-display font-bold mb-1">{plan.name}</h3>
          <p className="text-aurora-muted text-sm">{plan.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold">
              ${price}
            </span>
            <span className="text-aurora-muted">/month</span>
          </div>
          {isYearly && price > 0 && (
            <p className="text-sm text-aurora-success mt-1">
              Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
            </p>
          )}
        </div>

        <GlowingButton
          variant={plan.ctaVariant}
          className="w-full mb-6"
        >
          {plan.cta}
        </GlowingButton>

        <ul className="space-y-3 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              {feature.included ? (
                <Check size={18} className="text-aurora-success flex-shrink-0" />
              ) : (
                <X size={18} className="text-aurora-muted flex-shrink-0" />
              )}
              <span className={cn(
                'text-sm',
                feature.included ? 'text-aurora-text' : 'text-aurora-muted'
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  );
}

function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <GlassCard 
      className="cursor-pointer" 
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-medium text-left">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight 
            size={20} 
            className={cn(
              'flex-shrink-0 transition-transform',
              isOpen && 'rotate-90'
            )} 
          />
        </motion.div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-aurora-muted mt-4 text-left">{answer}</p>
      </motion.div>
    </GlassCard>
  );
}

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <PricingSEO />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-aurora-secondary/10 border border-aurora-secondary/30 mb-6">
              <Sparkles size={16} className="text-aurora-secondary" />
              <span className="text-sm font-medium text-aurora-secondary">Simple Pricing</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              Choose your{' '}
              <span className="aurora-gradient-text">plan</span>
            </h1>

            <p className="text-xl text-aurora-muted max-w-2xl mx-auto mb-10">
              Start free, upgrade when you're ready. All plans include core features 
              with no hidden fees.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn(
                'text-sm font-medium',
                !isYearly ? 'text-aurora-text' : 'text-aurora-muted'
              )}>
                Monthly
              </span>
              
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-7 rounded-full bg-aurora-surface border border-aurora-border"
              >
                <motion.div
                  animate={{ x: isYearly ? 28 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 rounded-full bg-aurora-primary"
                />
              </button>
              
              <span className={cn(
                'text-sm font-medium',
                isYearly ? 'text-aurora-text' : 'text-aurora-muted'
              )}>
                Yearly
              </span>
              
              <span className="px-2 py-1 rounded-full bg-aurora-success/10 text-aurora-success text-xs font-medium">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard 
                key={plan.name} 
                plan={plan} 
                isYearly={isYearly} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: 'SSL Encrypted' },
              { icon: Clock, label: '30-Day Refund' },
              { icon: Infinity, label: 'Unlimited on Pro+' },
              { icon: Sparkles, label: 'No Hidden Fees' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <item.icon className="w-8 h-8 text-aurora-primary mb-2" />
                <span className="text-sm text-aurora-muted">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-aurora-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard>
                  <blockquote className="text-aurora-text mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-aurora-primary/20 flex items-center justify-center">
                      <span className="text-aurora-primary font-medium">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
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

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-14 h-14 rounded-2xl bg-aurora-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-7 h-7 text-aurora-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">
              Frequently Asked{' '}
              <span className="text-aurora-primary">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                />
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
            className="rounded-3xl p-12 bg-gradient-to-br from-aurora-primary/10 to-aurora-secondary/10"
          >
            <h2 className="text-3xl font-display font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-aurora-muted mb-8">
              Our team is here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <GlowingButton icon={<ArrowRight size={18} />} iconPosition="right">
                  Contact Sales
                </GlowingButton>
              </Link>
              <a 
                href="mailto:sales@buildbrief.com"
                className="text-aurora-muted hover:text-aurora-text transition-colors"
              >
                sales@buildbrief.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
