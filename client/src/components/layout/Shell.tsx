import React from 'react';

export function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen relative overflow-hidden text-cosmos-text">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 bg-cosmos-bg">
                <div className="absolute inset-0 bg-cosmos-gradient opacity-80" />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cosmos-primary/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cosmos-secondary/20 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8">
                <nav className="flex justify-between items-center mb-16">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmos-primary to-cosmos-secondary">
                        BuildBrief 🚀
                    </div>
                    <div className="flex gap-4">
                        {/* Nav items can go here */}
                    </div>
                </nav>

                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}
