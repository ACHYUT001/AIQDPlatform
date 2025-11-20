'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function Contact() {
    return (
        <section id="contact" className="py-24 bg-black relative">
            <div className="container mx-auto px-4 max-w-4xl">
                <Card className="bg-white/5 border-white/10 text-white">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold mb-2">Get in Touch</CardTitle>
                        <CardDescription className="text-gray-400 text-lg">
                            Have questions? We'd love to hear from you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                                    <Input id="name" placeholder="John Doe" className="bg-black/20 border-white/10 text-white placeholder:text-gray-600" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                                    <Input id="email" type="email" placeholder="john@example.com" className="bg-black/20 border-white/10 text-white placeholder:text-gray-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                                <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] bg-black/20 border-white/10 text-white placeholder:text-gray-600" />
                            </div>
                            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8">
                                Send Message
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
