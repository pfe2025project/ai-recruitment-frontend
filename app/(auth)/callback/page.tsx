/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { handleAuthCallback, getCurrentUser } from '@/lib/api/auth'
import Loader from '@/components/ui/loader'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from Supabase
        const session = await handleAuthCallback()
        
        if (!session) {
          throw new Error('No session found')
        }

        // Get user info
        const user = await getCurrentUser()
        if (!user) {
          throw new Error('User not found')
        }
        const role = searchParams.get('role') || 'candidate'

        // Register user in our backend
        const response = await fetch('http://127.0.0.1:5000/auth/google-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name,
              avatar_url: user.user_metadata?.avatar_url,
            },
            role: role,
            access_token: session.access_token
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.details || 'Failed to register user')
        }

        // Store session info
        localStorage.setItem('access_token', session.access_token)
        localStorage.setItem('role', role)

        // Redirect to dashboard
        router.push(`/${role}/dashboard`)

      } catch (err: any) {
        console.error('Auth callback error:', err)
        setError(err.message)
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <Loader role="candidate" />
}