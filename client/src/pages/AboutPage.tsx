import { motion } from 'framer-motion';
import { 
  Target, Rocket, Heart, Users, Globe, Zap,
  Linkedin, Twitter, Github, ArrowRight, Mail
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { SEO } from '../components/seo/SEO';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Target,
    title: 'Precision First',
    description: 'We believe in the power of precise specifications to eliminate ambiguity and accelerate development.'
  },
  {
    icon: Zap,
    title: 'Move Fast',
    description: 'Speed matters. Our AI helps you go from idea to specification in minutes, not weeks.'
  },
  {
    icon: Users,
    title: 'Human-Centered',
    description: 'Technology should serve people. We design for builders of all technical backgrounds.'
  },
  {
    icon: Heart,
    title: 'Build with Love',
    description: 'We\'re passionate about helping creators bring their visions to life.'
  }
];

const milestones = [
  { year: '2023', event: 'BuildBrief founded with a vision to democratize technical specification' },
  { year: '2024', event: 'Launched AI-powered interview system with adaptive questioning' },
  { year: '2024', event: 'Reached 10,000+ specifications generated worldwide' },
  { year: '2025', event: 'Introduced team collaboration and enterprise features' },
];

const team = [
  {
    name: 'Arjun Arihant',
    role: 'Founder & CEO',
    bio: 'Former PM with a passion for bridging the gap between ideas and execution.',
    social: { linkedin: '#', twitter: '#', github: '#' }
  },
  {
    name: 'Coming Soon',
    role: 'CTO',
    bio: 'Team expansion in progress. Join us!',
    social: {}
  },
  {
    name: 'Coming Soon',
    role: 'Head of Design',
    bio: 'Team expansion in progress. Join us!',
    social: {}
  },
  {
    name: 'Coming Soon',
    role: 'Head of AI',
    bio: 'Team expansion in progress. Join us!',
    social: {}
  }
];

export function AboutPage() {
  return (
    <>
      <SEO 
        title="About Us"
        description="Learn about BuildBrief's mission to transform how ideas become production-ready specifications. Meet our team and discover our story."
        keywords={['about BuildBrief', 'our mission', 'AI company', 'product specification', 'team']}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-aurora-primary/10 border border-aurora-primary/30 mb-6">
              <Globe size={16} className="text-aurora-primary" />
              <span className="text-sm font-medium text-aurora-primary">Our Story</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              Building the future of{' '}
              <span className="aurora-gradient-text">product specification</span>
            </h1>

            <p className="text-xl text-aurora-muted max-w-3xl mx-auto">
              We believe every great product starts with a clear vision. BuildBrief exists 
              to help creators, founders, and teams transform their ideas into 
              production-ready specifications—faster than ever before.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-aurora-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-aurora-secondary/10 
                              text-aurora-secondary text-sm font-medium mb-4">
                Our Mission
              </span>
              
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
                Democratizing Technical{' '}
                <span className="text-aurora-primary">Specification</span>
              </h2>
              
              <p className="text-aurora-muted text-lg mb-6">
                Too many great ideas never see the light of day because of the gap between 
                vision and technical specification. We\'re here to bridge that gap.
              </p>
              
              <p className="text-aurora-muted">
                By combining cutting-edge AI with proven product management methodologies, 
                we\'ve created a tool that helps anyone—from non-technical founders to 
                experienced product managers—create comprehensive, precise specifications 
                in minutes instead of weeks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: '10K+', label: 'Specs Created' },
                { number: '50+', label: 'Countries' },
                { number: '98%', label: 'Happy Users' },
                { number: '24/7', label: 'AI Available' },
              ].map((stat) => (
                <GlassCard key={stat.label} className="text-center">
                  <div className="text-3xl font-display font-bold text-aurora-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-aurora-muted">{stat.label}</div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-aurora-accent/10 
                            text-aurora-accent text-sm font-medium mb-4">
              Our Values
            </span>
            
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              What we{' '}
              <span className="aurora-gradient-text">believe in</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover className="h-full">
                  <value.icon className="w-10 h-10 text-aurora-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-aurora-muted">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-aurora-surface/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-aurora-primary/10 
                            text-aurora-primary text-sm font-medium mb-4">
              Our Journey
            </span>
            
            <h2 className="text-3xl lg:text-4xl font-display font-bold">
              Milestones so{' '}
              <span className="text-aurora-secondary">far</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-xl font-display font-bold text-aurora-primary">
                    {milestone.year}
                  </span>
                </div>
                
                <div className="flex-shrink-0 relative">
                  <div className="w-4 h-4 rounded-full bg-aurora-primary" />
                  {i < milestones.length - 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-aurora-border" />
                  )}
                </div>
                
                <GlassCard className="flex-1">
                  <p className="text-aurora-text">{milestone.event}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-aurora-secondary/10 
                            text-aurora-secondary text-sm font-medium mb-4">
              Our Team
            </span>
            
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Meet the{' '}
              <span className="aurora-gradient-text">builders</span>
            </h2>
            
            <p className="text-aurora-muted">
              We're a small but mighty team passionate about helping creators succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-aurora-primary to-aurora-secondary 
                                  mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name === 'Coming Soon' ? '?' : member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-aurora-primary text-sm mb-2">{member.role}</p>
                  <p className="text-aurora-muted text-sm mb-4">{member.bio}</p>
                  
                  {member.name !== 'Coming Soon' && (
                    <div className="flex items-center justify-center gap-3">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-aurora-muted hover:text-aurora-primary transition-colors">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="text-aurora-muted hover:text-aurora-primary transition-colors">
                          <Twitter size={18} />
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} className="text-aurora-muted hover:text-aurora-primary transition-colors">
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center rounded-3xl p-12 bg-gradient-to-br from-aurora-primary/10 to-aurora-secondary/10"
          >
            <Rocket className="w-12 h-12 text-aurora-primary mx-auto mb-6" />
            
            <h2 className="text-3xl font-display font-bold mb-4">
              Join our team
            </h2>
            
            <p className="text-aurora-muted mb-8">
              We're always looking for talented people who share our passion for 
              building great products.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/careers">
                <GlowingButton icon={<ArrowRight size={18} />} iconPosition="right">
                  View Open Positions
                </GlowingButton>
              </Link>
              <a 
                href="mailto:careers@buildbrief.com"
                className="flex items-center gap-2 text-aurora-muted hover:text-aurora-text transition-colors"
              >
                <Mail size={18} />
                careers@buildbrief.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
