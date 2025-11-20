'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'

export function WelcomeSuccess() {
    return (
        <Card className="glass border-none text-white animate-fade-in-up">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,163,0.2)]">
                    <CheckCircle2 className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(0,255,163,0.5)]" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Welcome Aboard!
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 pt-4">
                <div className="space-y-2">
                    <p className="text-lg text-white/90">
                        Your profile has been successfully verified.
                    </p>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        We're excited to have you join our community of contributors. Our team is reviewing your profile and will contact you shortly with next steps.
                    </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-white">What happens next?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Look out for an email from our team within the next 24-48 hours. We'll schedule a quick onboarding call to get you started.
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/">
                        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all hover:scale-105">
                            Return to Home <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
