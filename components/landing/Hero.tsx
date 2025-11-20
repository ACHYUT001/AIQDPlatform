'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-background">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px] animate-float" />
                <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-8 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm animate-fade-in-up">
                        Now accepting new contributors
                    </span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8">
                        Shape the Future of <br />
                        <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-500 bg-clip-text text-transparent text-glow">
                            Artificial Intelligence
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join an elite workforce of data contributors. Monetize your expertise by providing high-quality data for the world's leading AI models.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/onboarding">
                            <Button size="lg" className="h-14 px-10 text-lg bg-primary text-black hover:bg-primary/90 rounded-full shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-all hover:scale-105">
                                Start Contributing
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#product">
                            <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-white/10 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full transition-all hover:scale-105">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
