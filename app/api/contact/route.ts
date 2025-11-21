import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase Admin client to bypass RLS for insertion if needed, 
// though our policy allows public inserts. Using service role key ensures it works regardless of auth state.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message } = body

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Insert into database
        const { error } = await supabaseAdmin
            .from('contact_messages')
            .insert([
                {
                    name,
                    email,
                    message,
                },
            ])

        if (error) {
            console.error('Error saving contact message:', error)
            return NextResponse.json(
                { error: 'Failed to send message' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { success: true, message: 'Message sent successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Unexpected error in contact API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
