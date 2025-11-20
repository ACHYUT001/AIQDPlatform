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
        <section id="product" className="py-32 bg-background relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Why Contribute to <span className="text-primary text-glow">AIQD</span>?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl mx-auto text-lg"
                    >
                        We provide the infrastructure for you to monetize your knowledge and help build safer, smarter AI systems.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-8 rounded-2xl glass glass-hover group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
