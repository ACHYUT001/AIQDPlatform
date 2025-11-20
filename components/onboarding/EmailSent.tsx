'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Mail, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

type EmailSentProps = {
    email: string
    onResend: () => Promise<void>
}

export function EmailSent({ email: propEmail, onResend }: EmailSentProps) {
    const [isResending, setIsResending] = useState(false)
    const [resendCount, setResendCount] = useState(0)
    const [email, setEmail] = useState(propEmail)

    useEffect(() => {
        // Try to get email from localStorage if prop is empty
        if (!propEmail) {
            const storedEmail = localStorage.getItem('pending_email')
            if (storedEmail) {
                setEmail(storedEmail)
            }
        }
    }, [propEmail])

    const handleResend = async () => {
        if (resendCount >= 3) return

        setIsResending(true)
        try {
            await onResend()
            setResendCount(prev => prev + 1)
        } finally {
            setIsResending(false)
        }
    }

    return (
        <Card className="glass border-none text-white max-w-md mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(0,255,163,0.5)]" />
                </div>
                <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                <CardDescription className="text-muted-foreground">
                    We sent a magic link to <span className="text-white font-medium">{email}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Click the link in the email to complete your signup. The link will expire in 24 hours.
                </p>

                <Button
                    variant="outline"
                    onClick={handleResend}
                    disabled={isResending || resendCount >= 3}
                    className="w-full border-white/10 hover:bg-white/5 hover:border-primary/30 transition-all"
                >
                    {isResending ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" /> Resend Email
                        </>
                    )}
                </Button>

                {resendCount >= 3 && (
                    <p className="text-sm text-destructive">
                        Maximum resend limit reached. Please try again later.
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    Didn't receive the email? Check your spam folder.
                </p>
            </CardContent>
        </Card>
    )
}
