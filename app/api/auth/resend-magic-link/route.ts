import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get pending profile
        const { data: pendingProfile, error: fetchError } = await supabase
            .from('pending_profiles')
            .select('*')
            .eq('token', token)
            .single()

        if (fetchError || !pendingProfile) {
            return NextResponse.json({ error: 'Invalid token', expired: false }, { status: 400 })
        }

        // Check if expired
        const isExpired = new Date(pendingProfile.expires_at) < new Date()

        if (isExpired) {
            // Return the pending profile data so client can restore form
            return NextResponse.json({
                expired: true,
                data: {
                    email: pendingProfile.email,
                    username: pendingProfile.username,
                    fullName: pendingProfile.full_name,
                    bio: pendingProfile.bio,
                    website: pendingProfile.website,
                    linkedinUrl: pendingProfile.linkedin_url,
                    githubUrl: pendingProfile.github_url,
                    skills: pendingProfile.skills,
                    resumeUrl: pendingProfile.resume_url,
                }
            }, { status: 200 })
        }

        // Token not expired - resend email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const verificationUrl = `${baseUrl}/verify?token=${token}`

        const { error: emailError } = await supabase.auth.signInWithOtp({
            email: pendingProfile.email,
            options: {
                emailRedirectTo: verificationUrl,
                shouldCreateUser: false,
            }
        })

        if (emailError) {
            console.error('Error resending email:', emailError)
            return NextResponse.json({ error: 'Failed to resend email' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            expired: false,
            email: pendingProfile.email
        })

    } catch (error) {
        console.error('Resend magic link error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
