'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BasicInfoForm } from '@/components/onboarding/BasicInfoForm'
import { SkillsForm } from '@/components/onboarding/SkillsForm'
import { ResumeUpload } from '@/components/onboarding/ResumeUpload'
import { ReviewProfile } from '@/components/onboarding/ReviewProfile'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

type OnboardingStep = 'basic-info' | 'skills' | 'resume' | 'review'

export default function OnboardingPage() {
    const [step, setStep] = useState<OnboardingStep>('basic-info')
    const [formData, setFormData] = useState<any>({})
    const [isParsing, setIsParsing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const supabase = createClient()

    const handleBasicInfoSubmit = (data: any) => {
        setFormData({ ...formData, basicInfo: data })
        setStep('skills')
    }

    const handleSkillsSubmit = (skills: any[]) => {
        setFormData({ ...formData, skills })
        setStep('resume')
    }

    const handleResumeUpload = async (file: File) => {
        setIsParsing(true)
        try {
            // Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // Get public URL (or signed URL)
            // For now, we'll just store the path
            const resumePath = uploadData.path

            // Call parse API
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Failed to parse resume')

            const parsedData = await response.json()

            setFormData(prev => ({
                ...prev,
                resumeData: parsedData,
                resumePath
            }))

            toast({
                title: "Resume Parsed",
                description: "We've extracted details from your resume.",
            })

            setStep('review')
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to upload or parse resume. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsParsing(false)
        }
    }

    const handleSkipResume = () => {
        setStep('review')
    }

    const handleFinalSubmit = async () => {
        setIsSubmitting(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                // If no user, maybe redirect to login or handle anonymous?
                // For Phase 1, we assume they logged in via Google before this or we create a user here?
                // The flow says "Google Login" is step 1.
                // If they are not logged in, we should probably redirect to login.
                // But for now, let's assume they are or we'll handle it.
                toast({
                    title: "Authentication Required",
                    description: "Please sign in to save your profile.",
                    variant: "destructive"
                })
                return
            }

            // Save to profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: formData.basicInfo.fullName,
                    email: formData.basicInfo.email, // Should probably match auth email
                    bio: formData.basicInfo.bio,
                    website: formData.basicInfo.website,
                    resume_url: formData.resumePath,
                    role: 'contributor',
                    updated_at: new Date().toISOString(),
                })

            if (profileError) throw profileError

            // Save skills
            if (formData.skills?.length > 0) {
                const skillsToInsert = formData.skills.map((s: any) => ({
                    user_id: user.id,
                    skill_name: s.name,
                    proficiency: s.proficiency
                }))

                const { error: skillsError } = await supabase
                    .from('skills')
                    .insert(skillsToInsert)

                if (skillsError) throw skillsError
            }

            toast({
                title: "Profile Created",
                description: "Welcome to AIQD! Your profile has been set up.",
            })

            router.push('/dashboard') // Or wherever they go next
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Join as Contributor</h1>
                    <div className="flex justify-center space-x-2">
                        {['Basic Info', 'Skills', 'Resume', 'Review'].map((s, i) => {
                            const stepIndex = ['basic-info', 'skills', 'resume', 'review'].indexOf(step)
                            const isActive = i === stepIndex
                            const isCompleted = i < stepIndex

                            return (
                                <div key={s} className="flex items-center">
                                    <div className={`
                    w-3 h-3 rounded-full 
                    ${isActive ? 'bg-blue-500' : isCompleted ? 'bg-green-500' : 'bg-gray-700'}
                  `} />
                                    {i < 3 && <div className={`w-12 h-0.5 mx-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`} />}
                                </div>
                            )
                        })}
                    </div>
                </div>

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

                {step === 'resume' && (
                    <ResumeUpload
                        onUpload={handleResumeUpload}
                        onSkip={handleSkipResume}
                        onBack={() => setStep('skills')}
                        isParsing={isParsing}
                    />
                )}

                {step === 'review' && (
                    <ReviewProfile
                        data={formData}
                        onSubmit={handleFinalSubmit}
                        onBack={() => setStep('resume')}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    )
}
