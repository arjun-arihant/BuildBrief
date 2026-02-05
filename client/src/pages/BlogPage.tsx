import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Clock, Search, BookOpen, Lightbulb, Code, TrendingUp, ChevronRight
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { Input } from '../components/ui/Input';
import { SEO } from '../components/seo/SEO';
import { cn } from '../lib/utils';

const categories = [
  { name: 'All', slug: 'all', icon: BookOpen },
  { name: 'Product', slug: 'product', icon: Lightbulb },
  { name: 'Engineering', slug: 'engineering', icon: Code },
  { name: 'AI Trends', slug: 'ai-trends', icon: TrendingUp },
];

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Writing Great Product Specifications',
    excerpt: 'Learn the key elements that make specifications clear, actionable, and developer-friendly. A guide for PMs and founders.',
    category: 'product',
    author: 'Arjun Arihant',
    date: '2025-01-15',
    readTime: '8 min read',
    featured: true,
    tags: ['product management', 'specifications', 'best practices']
  },
  {
    id: 2,
    title: 'How AI is Transforming Software Architecture',
    excerpt: 'Exploring the impact of AI on system design, from automated decision-making to intelligent architecture recommendations.',
    category: 'ai-trends',
    author: 'BuildBrief Team',
    date: '2025-01-10',
    readTime: '6 min read',
    featured: false,
    tags: ['AI', 'architecture', 'future of development']
  },
  {
    id: 3,
    title: 'From Idea to Production: A Complete Guide',
    excerpt: 'Step-by-step guide on transforming your startup idea into a production-ready specification document.',
    category: 'product',
    author: 'Arjun Arihant',
    date: '2025-01-05',
    readTime: '12 min read',
    featured: false,
    tags: ['startups', 'MVP', 'planning']
  },
  {
    id: 4,
    title: 'The Rise of AI Coding Agents in 2025',
    excerpt: 'Understanding the landscape of AI coding agents and how to effectively work with them for maximum productivity.',
    category: 'ai-trends',
    author: 'BuildBrief Team',
    date: '2024-12-28',
    readTime: '7 min read',
    featured: false,
    tags: ['AI agents', 'Cursor', 'Windsurf']
  },
  {
    id: 5,
    title: 'Best Practices for Technical Documentation',
    excerpt: 'Writing documentation that developers actually want to read. Tips, templates, and tools for better docs.',
    category: 'engineering',
    author: 'BuildBrief Team',
    date: '2024-12-20',
    readTime: '5 min read',
    featured: false,
    tags: ['documentation', 'engineering', 'communication']
  },
  {
    id: 6,
    title: 'Understanding the Mega-Prompt Pattern',
    excerpt: 'Deep dive into why Mega-Prompts work so well with AI coding agents and how to craft them effectively.',
    category: 'ai-trends',
    author: 'Arjun Arihant',
    date: '2024-12-15',
    readTime: '9 min read',
    featured: false,
    tags: ['Mega-Prompts', 'prompt engineering', 'AI coding']
  }
];

function BlogCard({ post, featured = false }: { post: typeof blogPosts[0]; featured?: boolean }) {
  const category = categories.find(c => c.slug === post.category);
  
  if (featured) {
    return (
      <GlassCard hover className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video md:aspect-auto bg-gradient-to-br from-aurora-primary/20 to-aurora-secondary/20 
                          rounded-xl flex items-center justify-center">
            <BookOpen size={64} className="text-aurora-primary/50" />
          </div>
          
          <div className="flex flex-col justify-center p-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-aurora-primary/10 text-aurora-primary text-sm font-medium">
                {category?.name}
              </span>
              <span className="flex items-center gap-1 text-aurora-muted text-sm">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">
              <Link to={`/blog/${post.id}`} className="hover:text-aurora-primary transition-colors">
                {post.title}
              </Link>
            </h2>
            
            <p className="text-aurora-muted mb-4">{post.excerpt}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-aurora-surface text-aurora-muted">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-aurora-muted">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              
              <Link 
                to={`/blog/${post.id}`}
                className="flex items-center gap-1 text-aurora-primary hover:gap-2 transition-all"
              >
                Read more <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard hover className="h-full flex flex-col">
      <div className="aspect-video bg-gradient-to-br from-aurora-surface to-aurora-surfaceHover 
                      rounded-xl mb-4 flex items-center justify-center">
        <BookOpen size={40} className="text-aurora-primary/30" />
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <span className="px-2 py-0.5 rounded-full bg-aurora-primary/10 text-aurora-primary text-xs font-medium">
          {category?.name}
        </span>
        <span className="flex items-center gap-1 text-aurora-muted text-xs">
          <Clock size={12} />
          {post.readTime}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        <Link to={`/blog/${post.id}`} className="hover:text-aurora-primary transition-colors">
          {post.title}
        </Link>
      </h3>
      
      <p className="text-aurora-muted text-sm mb-4 flex-1">{post.excerpt}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-aurora-muted">{post.date}</span>
        <Link 
          to={`/blog/${post.id}`}
          className="flex items-center gap-1 text-aurora-primary"
        >
          Read <ChevronRight size={14} />
        </Link>
      </div>
    </GlassCard>
  );
}

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <>
      <SEO 
        title="Blog & Resources"
        description="Insights, guides, and best practices for AI-powered product specification, software architecture, and working with AI coding agents."
        keywords={['blog', 'AI specification', 'product management', 'software architecture', 'guides']}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-aurora-primary/10 border border-aurora-primary/30 mb-6">
              <BookOpen size={16} className="text-aurora-primary" />
              <span className="text-sm font-medium text-aurora-primary">Blog & Resources</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
              Insights for{' '}
              <span className="aurora-gradient-text">builders</span>
            </h1>

            <p className="text-xl text-aurora-muted max-w-2xl mx-auto mb-10">
              Guides, best practices, and insights on AI-powered specification, 
              product management, and software architecture.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora-muted" size={20} />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                  containerClassName="w-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  activeCategory === category.slug
                    ? 'bg-aurora-primary text-white'
                    : 'bg-aurora-surface text-aurora-muted hover:text-aurora-text hover:bg-aurora-surfaceHover'
                )}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {!searchQuery && activeCategory === 'all' && featuredPost && (
        <section className="pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-aurora-secondary" />
                <span className="text-aurora-secondary font-medium">Featured Article</span>
              </div>
              
              <BlogCard post={featuredPost} featured />
            </motion.div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold">
              {searchQuery ? 'Search Results' : 'Latest Articles'}
            </h2>
            <span className="text-aurora-muted">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <GlassCard className="text-center py-16">
              <Search size={48} className="text-aurora-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-aurora-muted">Try adjusting your search or category filter</p>
            </GlassCard>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center rounded-3xl p-12 bg-gradient-to-br from-aurora-primary/10 to-aurora-secondary/10"
          >
            <Sparkles className="w-12 h-12 text-aurora-primary mx-auto mb-6" />
            
            <h2 className="text-3xl font-display font-bold mb-4">
              Stay in the loop
            </h2>
            
            <p className="text-aurora-muted mb-8">
              Get the latest articles, guides, and product updates delivered to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12"
                containerClassName="w-full"
              />
              <GlowingButton className="whitespace-nowrap">
                Subscribe
              </GlowingButton>
            </form>
            
            <p className="text-xs text-aurora-muted mt-4">
              No spam, unsubscribe anytime. Read our{' '}
              <Link to="/privacy" className="text-aurora-primary hover:underline">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
