import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, username, fullName, bio, website, linkedinUrl, githubUrl, skills, resumeUrl } = body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Delete any existing pending profiles for this email
        await supabase
            .from('pending_profiles')
            .delete()
            .eq('email', email)

        // Generate unique verification token
        const token = crypto.randomBytes(32).toString('hex')

        // Save to pending_profiles
        const { error: insertError } = await supabase
            .from('pending_profiles')
            .insert({
                token,
                email,
                username,
                full_name: fullName,
                bio,
                website,
                linkedin_url: linkedinUrl,
                github_url: githubUrl,
                skills: skills || [],
                resume_url: resumeUrl,
            })

        if (insertError) {
            console.error('Error saving pending profile:', insertError)
            return NextResponse.json({ error: 'Failed to save profile', details: insertError.message }, { status: 500 })
        }

        // Generate verification URL - this is what the user will click
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const verificationUrl = `${baseUrl}/verify?token=${token}`

        // Send email using Supabase Auth's email service
        // Note: You'll need to customize the email template in Supabase Dashboard
        // Go to: Authentication → Email Templates → Magic Link
        const { error: emailError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // This tells Supabase where to redirect after email verification
                emailRedirectTo: verificationUrl,
                shouldCreateUser: false, // Don't create user yet, we'll do it in /verify
            }
        })

        if (emailError) {
            console.error('Error sending email:', emailError)
            return NextResponse.json({ error: 'Failed to send email', details: emailError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, token })
    } catch (error) {
        console.error('Magic link error:', error)
        return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 })
    }
}
