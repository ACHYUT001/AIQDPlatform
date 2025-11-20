'use client'

import { motion } from 'framer-motion'
import { Brain, ShieldCheck, Zap, Globe } from 'lucide-react'

const features = [
    {
        icon: Brain,
        title: "AI-Powered Matching",
        description: "Our advanced algorithms match your skills with the most relevant data projects, ensuring high acceptance rates."
    },
    {
        icon: ShieldCheck,
        title: "Quality First",
        description: "Rigorous verification processes ensure that your contributions are valued and compensated fairly."
    },
    {
        icon: Zap,
        title: "Instant Feedback",
        description: "Get real-time feedback on your submissions to improve your skills and earning potential."
    },
    {
        icon: Globe,
        title: "Global Workforce",
        description: "Join a diverse community of contributors from over 100 countries shaping the future of AI."
    }
]

export function ProductDetails() {
    return (
        <section id="product" className="py-24 bg-black relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Why Contribute to <span className="text-blue-500">AIQD</span>?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We provide the infrastructure for you to monetize your knowledge and help build safer, smarter AI systems.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <feature.icon className="w-12 h-12 text-blue-400 mb-6" />
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
