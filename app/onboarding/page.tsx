'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BasicInfoForm } from '@/components/onboarding/BasicInfoForm'
import { SkillsForm } from '@/components/onboarding/SkillsForm'
import { ResumeUpload } from '@/components/onboarding/ResumeUpload'
import { ReviewProfile } from '@/components/onboarding/ReviewProfile'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type OnboardingStep = 'basic-info' | 'skills' | 'resume' | 'review'

export default function OnboardingPage() {
    const [step, setStep] = useState<OnboardingStep>('resume')
    const [formData, setFormData] = useState<any>({})
    const [isParsing, setIsParsing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

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
            let resumePath = null
            try {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, file)

                if (uploadError) throw uploadError
                resumePath = uploadData.path
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
                email: parsedData.email || "",
                bio: parsedData.summary || "",
                website: "", // Not usually parsed, but could be if added to prompt
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
                resumePath
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
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast("Authentication Required", {
                    description: "Please sign in to save your profile.",
                })
                return
            }

            // Save to profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: formData.basicInfo.fullName,
                    email: formData.basicInfo.email,
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

            toast("Profile Created", {
                description: "Welcome to AIQD! Your profile has been set up.",
            })

            router.push('/dashboard')
        } catch (error) {
            console.error(error)
            toast("Error", {
                description: "Failed to save profile. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="container mx-auto max-w-2xl relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent text-glow">
                        Join as Contributor
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Start your journey by uploading your resume.
                    </p>

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
                    <ReviewProfile
                        data={formData}
                        onSubmit={handleFinalSubmit}
                        onBack={() => setStep('skills')}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    )
}
