import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Loader2 } from 'lucide-react'

type ReviewProfileProps = {
    data: any
    onSubmit: () => void
    onBack: () => void
    isSubmitting: boolean
    isGoogleSyncing?: boolean
    onGoogleLoginStart?: () => void
}

export function ReviewProfile({ data, onSubmit, onBack, isSubmitting, isGoogleSyncing, onGoogleLoginStart }: ReviewProfileProps) {
    const handleGoogleLogin = async () => {
        try {
            // 1. Save form data to localStorage
            localStorage.setItem('google_onboarding_data', JSON.stringify(data))

            // 2. Trigger OAuth with skipBrowserRedirect
            const supabase = createClient()
            const { data: { url }, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?flow=popup`,
                    skipBrowserRedirect: true,
                },
            })

            if (error) {
                toast.error('Failed to initiate Google Login')
                console.error(error)
                return
            }

            if (url) {
                // Open popup
                const width = 500
                const height = 600
                const left = window.screen.width / 2 - width / 2
                const top = window.screen.height / 2 - height / 2

                window.open(
                    url,
                    'Google Auth',
                    `width=${width},height=${height},left=${left},top=${top}`
                )

                // Notify parent component that auth flow started
                if (onGoogleLoginStart) {
                    onGoogleLoginStart()
                }
            }
        } catch (error) {
            console.error('Google login error:', error)
            toast.error('An error occurred')
        }
    }

    return (
        <Card className="glass border-none text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Review Your Profile</CardTitle>
                {/* <CardDescription className="text-muted-foreground text-center">
                    Please review your details before submitting.
                </CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-8">

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-primary">Basic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        <div>
                            <span className="text-muted-foreground block">Full Name</span>
                            <span>{data.basicInfo?.fullName}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Username</span>
                            <span>@{data.basicInfo?.username}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Email</span>
                            <span className="break-all">{data.basicInfo?.email}</span>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <span className="text-muted-foreground block">Bio</span>
                            <div>
                                <span className="whitespace-pre-wrap">{data.basicInfo?.bio}</span>
                            </div>
                        </div>
                        {data.basicInfo?.website && (
                            <div className="col-span-1 md:col-span-3">
                                <span className="text-muted-foreground block">Website</span>
                                <span className="text-blue-400 hover:underline cursor-pointer break-all">{data.basicInfo?.website}</span>
                            </div>
                        )}
                        {data.basicInfo?.linkedinUrl && (
                            <div className="col-span-1 md:col-span-3">
                                <span className="text-muted-foreground block">LinkedIn</span>
                                <span className="text-blue-400 hover:underline cursor-pointer break-all">{data.basicInfo?.linkedinUrl}</span>
                            </div>
                        )}
                        {data.basicInfo?.githubUrl && (
                            <div className="col-span-1 md:col-span-3">
                                <span className="text-muted-foreground block">GitHub</span>
                                <span className="text-blue-400 hover:underline cursor-pointer break-all">{data.basicInfo?.githubUrl}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-primary">Skills</h3>
                    <div
                        className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar pb-4"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                        }}
                    >
                        {data.skills?.map((skill: any) => (
                            <Badge key={skill.name} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {skill.name} ({skill.proficiency})
                            </Badge>
                        ))}
                        {(!data.skills || data.skills.length === 0) && (
                            <span className="text-muted-foreground text-sm">No skills added.</span>
                        )}
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <Button variant="outline" onClick={onBack} className="w-1/2 border-white/10 hover:bg-white/5 hover:text-white" disabled={isSubmitting || isGoogleSyncing}>Back</Button>
                    <Button
                        onClick={onSubmit}
                        className="w-1/2 bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] transition-all"
                        disabled={isSubmitting || isGoogleSyncing}
                    >
                        {isSubmitting && !isGoogleSyncing ? "Creating Profile..." : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Join
                            </>
                        )}
                    </Button>
                </div>

                {/* OAuth Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-black text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                {/* Google OAuth Button */}
                <Button
                    variant="outline"
                    className="w-full border-white/10 hover:bg-white/5 hover:border-primary/30 transition-all"
                    disabled={isSubmitting || isGoogleSyncing}
                    onClick={handleGoogleLogin}
                >
                    {isGoogleSyncing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
