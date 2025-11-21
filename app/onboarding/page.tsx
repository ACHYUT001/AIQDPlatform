'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BasicInfoForm } from '@/components/onboarding/BasicInfoForm'
import { SkillsForm } from '@/components/onboarding/SkillsForm'
import { ResumeUpload } from '@/components/onboarding/ResumeUpload'
import { ReviewProfile } from '@/components/onboarding/ReviewProfile'
import { EmailSent } from '@/components/onboarding/EmailSent'
import { WelcomeSuccess } from '@/components/onboarding/WelcomeSuccess'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

import { Loader2 } from 'lucide-react'

type OnboardingStep = 'basic-info' | 'skills' | 'resume' | 'review' | 'email-sent' | 'welcome'

function OnboardingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const [step, setStep] = useState<OnboardingStep>(() => {
        if (searchParams.get('step') === 'email-sent') return 'email-sent'
        if (searchParams.get('step') === 'welcome') return 'welcome'
        return 'resume'
    })
    const [formData, setFormData] = useState<any>({})
    const [isParsing, setIsParsing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    // Add loading state for data restoration to prevent flash of empty content
    const [isRestoring, setIsRestoring] = useState(false)

    // Handle form restoration and query params
    useEffect(() => {
        const queryStep = searchParams.get('step')
        const shouldRestore = searchParams.get('restore')

        // Handle email-sent step navigation
        if (queryStep === 'email-sent') {
            setStep('email-sent')
            return
        }

        // Handle welcome step navigation
        if (queryStep === 'welcome') {
            setStep('welcome')
            return
        }



        // Handle form restoration from localStorage
        if (shouldRestore === 'true') {
            const restoredData = localStorage.getItem('onboarding_restore')
            if (restoredData) {
                try {
                    const parsed = JSON.parse(restoredData)
                    setFormData({
                        basicInfo: {
                            fullName: parsed.fullName || '',
                            username: parsed.username || '',
                            email: parsed.email || '',
                            bio: parsed.bio || '',
                            website: parsed.website || '',
                            linkedinUrl: parsed.linkedinUrl || '',
                            githubUrl: parsed.githubUrl || '',
                        },
                        skills: parsed.skills || [],
                        resumeUrl: parsed.resumeUrl || null,
                    })
                    // Clear the restore data
                    localStorage.removeItem('onboarding_restore')
                    // Start from review to let user quickly submit again
                    setStep('review')
                    toast('Form Restored', {
                        description: 'Your previous data has been restored. Please review and submit again.',
                    })
                } catch (error) {
                    console.error('Failed to restore form data:', error)
                }
            }
        }
    }, [searchParams])

    useEffect(() => {
        const handleAuthCompletion = (e: StorageEvent) => {
            if (e.key === 'google_auth_completed') {
                // Clear the flag
                localStorage.removeItem('google_auth_completed')

                // Trigger sync logic
                setIsRestoring(true)

                // We need to refresh the session first as the popup handled the auth
                supabase.auth.refreshSession().then(({ error }) => {
                    if (!error) {
                        // Reuse the sync logic but we need to get data from storage first
                        const storedData = localStorage.getItem('google_onboarding_data')
                        if (storedData) {
                            const parsedData = JSON.parse(storedData)
                            // Call API
                            fetch('/api/auth/complete-profile-google', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(parsedData),
                            })
                                .then(res => res.json())
                                .then(result => {
                                    if (result.error) throw new Error(result.error)
                                    localStorage.removeItem('google_onboarding_data')
                                    setStep('welcome')
                                    toast.success('Profile created successfully!')
                                })
                                .catch(err => {
                                    console.error(err)
                                    toast.error('Failed to sync profile')
                                })
                                .finally(() => setIsRestoring(false))
                        }
                    }
                })
            }
        }

        window.addEventListener('storage', handleAuthCompletion)
        return () => window.removeEventListener('storage', handleAuthCompletion)
    }, [supabase.auth])

    const handleBasicInfoSubmit = (data: any) => {
        setFormData({ ...formData, basicInfo: data })
        setStep('skills')
    }

    const handleSkillsSubmit = (skills: any[]) => {
        setFormData({ ...formData, skills })
        setStep('review')
    }

    const handleResumeUpload = async (file: File) => {
        setIsParsing(true)
        try {
            // Upload file to Supabase Storage
            let resumeUrl = null
            try {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, file)

                if (uploadError) throw uploadError
                resumeUrl = uploadData.path
            } catch (uploadErr) {
                console.error('Resume upload failed:', uploadErr)
                toast("Upload Warning", {
                    description: "Could not save PDF file, but proceeding with parsing.",
                })
            }

            // Call parse API
            const formDataPayload = new FormData()
            formDataPayload.append('file', file)

            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formDataPayload,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to parse resume')
            }

            const parsedData = await response.json()

            // Map parsed data to form structure
            const prefilledBasicInfo = {
                fullName: parsedData.fullName || "",
                username: "", // User must choose a unique username
                email: parsedData.email || "",
                bio: parsedData.summary || "",
                website: parsedData.website || "", // Can be parsed from resume
                linkedinUrl: parsedData.linkedinUrl || "", // Can be parsed from resume
                githubUrl: parsedData.githubUrl || "", // Can be parsed from resume
            }

            // Handle skills - they might be strings or objects with name/proficiency
            const prefilledSkills = parsedData.skills?.map((skill: any) => {
                if (typeof skill === 'string') {
                    return { name: skill, proficiency: 'intermediate' as const }
                }
                return {
                    name: skill.name || skill,
                    proficiency: skill.proficiency || 'intermediate' as const
                }
            }) || []

            setFormData((prev: any) => ({
                ...prev,
                basicInfo: prefilledBasicInfo,
                skills: prefilledSkills,
                resumeData: parsedData,
                resumeUrl
            }))

            toast("Resume Parsed", {
                description: "We've extracted details from your resume. Please review them.",
            })

            setStep('basic-info')
        } catch (error) {
            console.error(error)
            toast("Error", {
                description: (error as Error).message || "Failed to upload or parse resume. Please try again.",
            })
        } finally {
            setIsParsing(false)
        }
    }

    const handleSkipResume = () => {
        setStep('basic-info')
    }

    const handleFinalSubmit = async () => {
        setIsSubmitting(true)
        try {
            // Send magic link email
            const response = await fetch('/api/auth/send-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.basicInfo.email,
                    username: formData.basicInfo.username,
                    fullName: formData.basicInfo.fullName,
                    bio: formData.basicInfo.bio,
                    website: formData.basicInfo.website,
                    linkedinUrl: formData.basicInfo.linkedinUrl,
                    githubUrl: formData.basicInfo.githubUrl,
                    skills: formData.skills,
                    resumeUrl: formData.resumeUrl,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to send verification email')
            }

            // Store email in localStorage for EmailSent component
            localStorage.setItem('pending_email', formData.basicInfo.email)

            toast("Email Sent", {
                description: "Check your inbox for the verification link.",
            })

            // Show email sent confirmation
            setStep('email-sent')
        } catch (error) {
            console.error(error)
            toast("Error", {
                description: "Failed to send verification email. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendEmail = async () => {
        return handleFinalSubmit()
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 relative overflow-x-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="container mx-auto max-w-2xl relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent text-glow">
                        Join as Contributor
                    </h1>

                    <div className="flex justify-center space-x-2">
                        {['Resume', 'Basic Info', 'Skills', 'Review'].map((s, i) => {
                            const stepOrder = ['resume', 'basic-info', 'skills', 'review']
                            const stepIndex = stepOrder.indexOf(step)
                            const isActive = i === stepIndex
                            const isCompleted = i < stepIndex

                            return (
                                <div key={s} className="flex items-center">
                                    <div className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${isActive ? 'bg-primary shadow-[0_0_10px_var(--primary)] scale-125' : isCompleted ? 'bg-primary/50' : 'bg-white/10'}
                  `} />
                                    {i < 3 && <div className={`w-12 h-0.5 mx-1 transition-all duration-300 ${isCompleted ? 'bg-primary/50' : 'bg-white/10'}`} />}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {step === 'resume' && (
                    <ResumeUpload
                        onUpload={handleResumeUpload}
                        onSkip={handleSkipResume}
                        onBack={() => { }} // No back from first step
                        isParsing={isParsing}
                    />
                )}

                {step === 'basic-info' && (
                    <BasicInfoForm
                        defaultValues={formData.basicInfo}
                        onSubmit={handleBasicInfoSubmit}
                    />
                )}

                {step === 'skills' && (
                    <SkillsForm
                        defaultValues={formData.skills}
                        onSubmit={handleSkillsSubmit}
                        onBack={() => setStep('basic-info')}
                    />
                )}

                {step === 'review' && (
                    isRestoring ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-primary animate-pulse">
                            <Loader2 className="h-12 w-12 animate-spin mb-4" />
                            <p className="text-lg font-medium">Syncing your profile...</p>
                        </div>
                    ) : (
                        <ReviewProfile
                            data={formData}
                            onSubmit={handleFinalSubmit}
                            onBack={() => setStep('skills')}
                            isSubmitting={isSubmitting}
                            isGoogleSyncing={isRestoring}
                            onGoogleLoginStart={() => setIsRestoring(true)}
                        />
                    )
                )}

                {step === 'email-sent' && (
                    <EmailSent
                        email={formData.basicInfo?.email || ''}
                        onResend={handleResendEmail}
                    />
                )}

                {step === 'welcome' && (
                    <WelcomeSuccess />
                )}
            </div>
        </div>
    )
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-primary">Loading...</div>
            </div>
        }>
            <OnboardingContent />
        </Suspense>
    )
}
