import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-aurora-bg text-aurora-text">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary gradient */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
                     bg-gradient-radial from-aurora-primary/10 via-transparent to-transparent 
                     blur-3xl opacity-60"
        />
        
        {/* Secondary accent */}
        <div 
          className="absolute top-1/4 right-0 w-[500px] h-[500px] 
                     bg-gradient-radial from-aurora-secondary/8 via-transparent to-transparent 
                     blur-3xl opacity-40"
        />
        
        {/* Tertiary accent */}
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] 
                     bg-gradient-radial from-aurora-accent/8 via-transparent to-transparent 
                     blur-3xl opacity-30"
        />

        {/* Floating orbs */}
        <motion.div
          animate={{ 
            y: [0, -30, 0], 
            x: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-72 h-72 
                     bg-aurora-primary/5 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            y: [0, 25, 0], 
            x: [0, -15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-[15%] w-96 h-96 
                     bg-aurora-secondary/5 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-32 left-1/3 w-64 h-64 
                     bg-aurora-accent/5 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        
        <main className="pt-16 lg:pt-20">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
