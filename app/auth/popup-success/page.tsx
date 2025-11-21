'use client'

import { useEffect } from 'react'

export default function PopupSuccess() {
    useEffect(() => {
        // Notify the parent window
        localStorage.setItem('google_auth_completed', Date.now().toString())
        window.close()
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <p>Authentication successful! You can close this window.</p>
        </div>
    )
}
