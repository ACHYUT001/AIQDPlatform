'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function Contact() {
    return (
        <section id="contact" className="py-32 bg-background relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <Card className="glass border-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <CardHeader className="text-center pt-12 pb-8 relative">
                        <CardTitle className="text-4xl font-bold mb-4 text-white">Get in <span className="text-primary text-glow">Touch</span></CardTitle>
                        <CardDescription className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Have questions about contributing or integrating our data? We'd love to hear from you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 md:p-12 relative">
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-300 ml-1">Name</label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="message" className="text-sm font-medium text-gray-300 ml-1">Message</label>
                                <Textarea
                                    id="message"
                                    placeholder="How can we help you?"
                                    className="min-h-[180px] bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 resize-none transition-all"
                                />
                            </div>
                            <div className="flex justify-center pt-4">
                                <Button className="w-full md:w-auto min-w-[200px] h-12 bg-primary text-black hover:bg-primary/90 text-lg font-medium rounded-full shadow-[0_0_20px_rgba(0,255,163,0.2)] hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] transition-all hover:scale-105">
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
