import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { basicInfo, skills, resumeUrl } = body

        const supabase = await createClient()

        // 1. Verify session
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Create or update profile        
        // We use the user.id as the profile id
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                username: basicInfo.username,
                full_name: basicInfo.fullName,
                email: user.email,
                bio: basicInfo.bio,
                website: basicInfo.website,
                linkedin_url: basicInfo.linkedinUrl,
                github_url: basicInfo.githubUrl,
                resume_url: resumeUrl,
                role: 'contributor',
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id'  // Update if profile with this ID already exists
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
            // Check for unique constraint violation on username
            if (profileError.code === '23505' && profileError.message?.includes('username')) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
            }
            return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
        }

        // Save skills
        if (skills && Array.isArray(skills) && skills.length > 0) {
            const skillsToInsert = skills.map((s: any) => ({
                user_id: user.id,
                skill_name: s.name,
                proficiency: s.proficiency
            }))

            await supabase.from('skills').insert(skillsToInsert)
        }


        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Google profile completion error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
