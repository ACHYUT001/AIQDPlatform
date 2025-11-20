import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        // Create Supabase admin client with service role key
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Get pending profile
        const { data: pendingProfile, error: fetchError } = await supabaseAdmin
            .from('pending_profiles')
            .select('*')
            .eq('token', token)
            .single()

        if (fetchError || !pendingProfile) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
        }

        // Check if user already has a profile (already signed up)
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', pendingProfile.email)
            .single()

        if (existingProfile) {
            // User is already fully onboarded
            return NextResponse.json({
                success: true,
                user: { id: existingProfile.id, email: pendingProfile.email },
                alreadyRegistered: true
            })
        }

        // Check if expired
        if (new Date(pendingProfile.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
        }

        // Check if already verified (but no profile found - rare edge case)
        if (pendingProfile.verified) {
            return NextResponse.json({ error: 'Token already used' }, { status: 400 })
        }

        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers?.users.find(u => u.email === pendingProfile.email)

        let userId: string

        if (existingUser) {
            // User already exists, use their ID
            userId = existingUser.id
            console.log('User already exists, using existing user:', existingUser.email)
        } else {
            // Create new user with admin API
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: pendingProfile.email,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    full_name: pendingProfile.full_name,
                }
            })

            if (authError || !authData.user) {
                console.error('Auth error:', authError)
                return NextResponse.json({ error: 'Failed to create user', details: authError?.message }, { status: 500 })
            }

            userId = authData.user.id
        }

        // Create or update profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                username: pendingProfile.username,
                full_name: pendingProfile.full_name,
                email: pendingProfile.email,
                bio: pendingProfile.bio,
                website: pendingProfile.website,
                linkedin_url: pendingProfile.linkedin_url,
                github_url: pendingProfile.github_url,
                resume_url: pendingProfile.resume_url,
                role: 'contributor',
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id'  // Update if profile with this ID already exists
            })

        if (profileError) {
            console.error('Profile error:', profileError)
            return NextResponse.json({ error: 'Failed to create profile', details: profileError.message }, { status: 500 })
        }

        // Save skills
        if (pendingProfile.skills && Array.isArray(pendingProfile.skills) && pendingProfile.skills.length > 0) {
            const skillsToInsert = pendingProfile.skills.map((s: any) => ({
                user_id: userId,
                skill_name: s.name,
                proficiency: s.proficiency
            }))

            await supabaseAdmin.from('skills').insert(skillsToInsert)
        }

        // Mark as verified
        await supabaseAdmin
            .from('pending_profiles')
            .update({ verified: true })
            .eq('token', token)

        // Create session for the user
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: pendingProfile.email,
        })

        if (sessionError) {
            console.error('Session error:', sessionError)
        }

        return NextResponse.json({
            success: true,
            user: { id: userId, email: pendingProfile.email },
            session: sessionData
        })

    } catch (error) {
        console.error('Verify token error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
