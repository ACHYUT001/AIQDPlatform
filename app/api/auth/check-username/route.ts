import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username || username.length < 3) {
        return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }

    try {
        const supabase = await createClient()

        // Check profiles table
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error checking username:', error)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        // If data exists, username is taken
        const available = !data

        return NextResponse.json({ available })
    } catch (error) {
        console.error('Username check error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
