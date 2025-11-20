'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-400 bg-blue-900/20 border border-blue-800/50 rounded-full">
                        Now accepting new contributors
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
                        Shape the Future of <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Artificial Intelligence
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join an elite workforce of data contributors. Monetize your expertise by providing high-quality data for the world's leading AI models.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/onboarding">
                            <Button size="lg" className="h-12 px-8 text-lg bg-white text-black hover:bg-gray-200 rounded-full">
                                Start Contributing
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#product">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-full">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Elements Animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl pointer-events-none">
                    {/* Add some decorative floating elements here if needed */}
                </div>
            </div>
        </section>
    )
}
