'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [message, setMessage] = useState('Verifying your email...')
    const [isRetrying, setIsRetrying] = useState(false)
    const [currentToken, setCurrentToken] = useState<string | null>(null)

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token')
            setCurrentToken(token)

            if (!token) {
                setStatus('error')
                setMessage('Invalid verification link')
                return
            }

            try {
                // Call our API to verify token
                // The API now handles checks for existing profiles, expiration, etc.
                const response = await fetch('/api/auth/verify-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Verification failed')
                }

                const data = await response.json()

                if (data.alreadyRegistered) {
                    setStatus('success')
                    setMessage('You are already verified! Redirecting...')
                } else {
                    setStatus('success')
                    setMessage('Email verified successfully! Redirecting...')
                }

                // Redirect to welcome screen
                setTimeout(() => {
                    router.push('/onboarding?step=welcome')
                }, 2000)

            } catch (error) {
                console.error('Verification error:', error)
                setStatus('error')
                setMessage((error as Error).message || 'Failed to verify email. Please try again.')
            }
        }

        verifyToken()
    }, [searchParams, router])

    const handleTryAgain = async () => {
        if (!currentToken) {
            router.push('/onboarding')
            return
        }

        setIsRetrying(true)

        try {
            // Call resend API
            const response = await fetch('/api/auth/resend-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: currentToken }),
            })

            const data = await response.json()

            if (data.expired) {
                // Token expired - restore form data
                if (data.data) {
                    // Store data in localStorage for form restoration
                    localStorage.setItem('onboarding_restore', JSON.stringify(data.data))
                }
                // Redirect to onboarding with restore flag
                router.push('/onboarding?restore=true')
            } else if (data.success) {
                // Email resent successfully - store email and redirect to email-sent page
                localStorage.setItem('pending_email', data.email)
                router.push('/onboarding?step=email-sent')
            } else {
                throw new Error(data.error || 'Failed to resend email')
            }
        } catch (error) {
            console.error('Retry error:', error)
            setMessage('Failed to retry. Redirecting to onboarding...')
            setTimeout(() => router.push('/onboarding'), 2000)
        } finally {
            setIsRetrying(false)
        }
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 flex items-center justify-center">
            <Card className="glass border-none text-white max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        {status === 'verifying' && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
                        {status === 'success' && <CheckCircle2 className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(0,255,163,0.5)]" />}
                        {status === 'error' && <XCircle className="h-8 w-8 text-destructive" />}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {status === 'verifying' && 'Verifying Email'}
                        {status === 'success' && 'Welcome to AIQD!'}
                        {status === 'error' && 'Verification Failed'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">{message}</p>

                    {status === 'error' && (
                        <Button
                            onClick={handleTryAgain}
                            disabled={isRetrying}
                            className="w-full bg-primary text-black hover:bg-primary/90"
                        >
                            {isRetrying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                </>
                            ) : (
                                'Try Again'
                            )}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    )
}
