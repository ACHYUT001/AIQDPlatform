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
        <section id="testimonials" className="py-32 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 mb-32 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 py-16 backdrop-blur-sm bg-white/5 rounded-3xl">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-500">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Trusted by <span className="text-primary text-glow">Experts</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
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
                            <Card className="bg-white/5 border-white/10 text-white h-full backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 shadow-lg">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <div className="mb-6 text-primary">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
                                            <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01703V8H14.017V2H4.01703V8H9.01703V18H5.01703C3.91246 18 3.01703 18.8954 3.01703 20V21H2.01703V22H14.017V21ZM24.017 21V20C24.017 18.8954 23.1216 18 22.017 18H18.017V8H23.017V2H13.017V8H18.017V16H15.017C13.9125 16 13.017 16.8954 13.017 18V21H12.017V22H24.017V21Z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-300 mb-8 flex-grow text-lg leading-relaxed">"{testimonial.content}"</p>
                                    <div className="flex items-center space-x-4 border-t border-white/10 pt-6">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src={testimonial.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary">{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-white">{testimonial.name}</div>
                                            <div className="text-sm text-primary/80">{testimonial.role}</div>
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
