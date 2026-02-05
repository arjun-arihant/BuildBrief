import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

const defaultSEO = {
  title: 'BuildBrief - AI-Powered Architecture Specification Engine',
  description: 'Transform your ideas into production-ready architecture specifications with BuildBrief. Our AI acts as a Senior PM, interviewing you to generate Mega-Prompts for AI coding agents.',
  keywords: ['AI architecture', 'software specification', 'Mega-Prompt', 'AI coding agents', 'project planning', 'technical documentation'],
  ogImage: 'https://buildbrief.com/og-image.jpg',
  ogType: 'website' as const,
  twitterCard: 'summary_large_image' as const,
  canonical: 'https://buildbrief.com',
};

export const SEO: React.FC<SEOProps> = ({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  ogImage = defaultSEO.ogImage,
  ogType = defaultSEO.ogType,
  twitterCard = defaultSEO.twitterCard,
  canonical = defaultSEO.canonical,
  noIndex = false,
  structuredData,
}) => {
  const fullTitle = title === defaultSEO.title ? title : `${title} | BuildBrief`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="BuildBrief" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@buildbrief" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Pre-configured SEO for common page types
export const HomeSEO = () => (
  <SEO
    structuredData={{
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BuildBrief',
      url: 'https://buildbrief.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://buildbrief.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }}
  />
);

export const PricingSEO = () => (
  <SEO
    title="Pricing Plans"
    description="Choose the perfect plan for your needs. Start free, upgrade when you're ready. Pro and Team plans with unlimited projects and collaboration features."
    keywords={['pricing', 'plans', 'subscription', 'AI tools pricing', 'software specification pricing']}
    ogType="product"
    structuredData={{
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'BuildBrief',
      description: 'AI-Powered Architecture Specification Engine',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '49',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }}
  />
);

export const ContactSEO = () => (
  <SEO
    title="Contact Us"
    description="Get in touch with the BuildBrief team. We're here to help you transform your ideas into production-ready specifications."
    keywords={['contact', 'support', 'help', 'customer service']}
    structuredData={{
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact BuildBrief',
      url: 'https://buildbrief.com/contact',
    }}
  />
);

export const BlogSEO = ({ title, description, date, author }: { 
  title: string; 
  description: string; 
  date: string; 
  author: string;
}) => (
  <SEO
    title={title}
    description={description}
    ogType="article"
    structuredData={{
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      datePublished: date,
      author: {
        '@type': 'Person',
        name: author,
      },
    }}
  />
);
