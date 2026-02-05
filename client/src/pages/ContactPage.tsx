import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, MessageCircle, HelpCircle, ArrowRight, Send,
  Twitter, Github, Linkedin, CheckCircle2, Clock,
  Sparkles, AlertCircle
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { Input } from '../components/ui/Input';
import { ContactSEO } from '../components/seo/SEO';
import { cn } from '../lib/utils';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'For general inquiries and support',
    value: 'hello@buildbrief.com',
    href: 'mailto:hello@buildbrief.com',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: Twitter,
    title: 'Twitter',
    description: 'Follow us for updates',
    value: '@buildbrief',
    href: 'https://twitter.com/buildbrief',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'Open source and contributions',
    value: 'github.com/buildbrief',
    href: 'https://github.com/arjun-arihant/buildbrief',
    color: 'from-gray-600 to-gray-800'
  },
  {
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Professional updates',
    value: 'linkedin.com/company/buildbrief',
    href: 'https://linkedin.com/company/buildbrief',
    color: 'from-blue-600 to-blue-800'
  }
];

const faqs = [
  {
    question: 'How quickly do you respond to inquiries?',
    answer: 'We aim to respond to all inquiries within 24 hours during business days. Pro and Team plan users get priority support with faster response times.'
  },
  {
    question: 'Do you offer custom enterprise solutions?',
    answer: 'Yes! We work with enterprises to provide custom integrations, dedicated support, and tailored solutions. Contact our sales team for more information.'
  },
  {
    question: 'Can I request a feature?',
    answer: 'Absolutely! We love hearing from our users. You can submit feature requests through this contact form or directly on our GitHub repository.'
  }
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <ContactSEO />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-aurora-primary/10 border border-aurora-primary/30 mb-6">
              <MessageCircle size={16} className="text-aurora-primary" />
              <span className="text-sm font-medium text-aurora-primary">Get in Touch</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              Let's{' '}
              <span className="aurora-gradient-text">talk</span>
            </h1>

            <p className="text-xl text-aurora-muted max-w-2xl mx-auto">
              Have a question, feedback, or just want to say hello? 
              We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-4"
            >
              <h2 className="text-2xl font-display font-bold mb-6">
                Other ways to reach us
              </h2>

              {contactMethods.map((method, i) => (
                <motion.a
                  key={method.title}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard hover className="flex items-start gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      'bg-gradient-to-br',
                      method.color
                    )}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{method.title}</h3>
                      <p className="text-sm text-aurora-muted mb-1">{method.description}</p>
                      <span className="text-sm text-aurora-primary truncate block">
                        {method.value}
                      </span>
                    </div>
                    
                    <ArrowRight size={18} className="text-aurora-muted flex-shrink-0" />
                  </GlassCard>
                </motion.a>
              ))}

              {/* Office Hours */}
              <GlassCard className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="text-aurora-primary" size={20} />
                  <h3 className="font-semibold">Office Hours</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-aurora-muted">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-aurora-muted">Saturday - Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <GlassCard className="h-full">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-aurora-success/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} className="text-aurora-success" />
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold mb-2">
                      Message Sent!
                    </h3>
                    
                    <p className="text-aurora-muted mb-6">
                      Thanks for reaching out. We'll get back to you within 24 hours.
                    </p>
                    
                    <GlowingButton 
                      variant="secondary" 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                    >
                      Send Another Message
                    </GlowingButton>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Your Name
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={cn(
                          'w-full h-12 px-4 rounded-xl',
                          'bg-aurora-surface border border-aurora-border/50',
                          'text-aurora-text',
                          'focus:outline-none focus:border-aurora-primary/50',
                          'transition-colors'
                        )}
                      >
                        <option value="">Select a topic...</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales & Enterprise</option>
                        <option value="partnerships">Partnerships</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        required
                        rows={5}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl resize-none',
                          'bg-aurora-surface border border-aurora-border/50',
                          'text-aurora-text placeholder:text-aurora-muted',
                          'focus:outline-none focus:border-aurora-primary/50',
                          'transition-colors'
                        )}
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-aurora-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                      </div>
                    )}

                    <GlowingButton
                      type="submit"
                      size="lg"
                      loading={isSubmitting}
                      icon={<Send size={18} />}
                      iconPosition="right"
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </GlowingButton>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-aurora-surface/30">
        <div className="max-w-4xl mx-auto">
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
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-aurora-muted">{faq.answer}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 bg-gradient-to-br from-aurora-primary/10 to-aurora-secondary/10"
          >
            <Sparkles className="w-12 h-12 text-aurora-primary mx-auto mb-6" />
            
            <h2 className="text-3xl font-display font-bold mb-4">
              Need immediate help?
            </h2>
            
            <p className="text-aurora-muted mb-8">
              Check out our documentation and guides for quick answers to common questions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/docs"
                className="px-6 py-3 rounded-xl bg-aurora-surface border border-aurora-border 
                           hover:border-aurora-primary/50 transition-colors"
              >
                View Documentation
              </a>
              <a 
                href="/guides"
                className="px-6 py-3 rounded-xl bg-aurora-surface border border-aurora-border 
                           hover:border-aurora-primary/50 transition-colors"
              >
                Browse Guides
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
