'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
    { label: "Contributors", value: "10K+" },
    { label: "Data Points", value: "50M+" },
    { label: "Hours Saved", value: "100K+" },
    { label: "Quality Score", value: "99.9%" },
]

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Linguist & Translator",
        content: "AIQD has allowed me to use my language skills to help train the next generation of translation models. The platform is intuitive and the pay is great.",
        avatar: "/avatars/sarah.jpg"
    },
    {
        name: "Marcus Rodriguez",
        role: "Software Developer",
        content: "I love the code annotation tasks. It's a great way to stay sharp while earning extra income on my own schedule.",
        avatar: "/avatars/marcus.jpg"
    },
    {
        name: "Elena Kovac",
        role: "Medical Researcher",
        content: "Contributing to medical datasets requires precision. AIQD's tools make it easy to ensure accuracy and quality.",
        avatar: "/avatars/elena.jpg"
    }
]

export function StatsAndTestimonials() {
    return (
        <section id="testimonials" className="py-24 bg-black relative">
            {/* Stats Section */}
            <div className="container mx-auto px-4 mb-32">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Trusted by Experts
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Hear from our community of contributors who are shaping the future of AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Card className="bg-white/5 border-white/10 text-white h-full">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <p className="text-gray-300 mb-8 flex-grow italic">"{testimonial.content}"</p>
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={testimonial.avatar} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
