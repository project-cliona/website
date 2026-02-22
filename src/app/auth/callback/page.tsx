'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/axios'
import { useUser } from '@/providers/userProvider'

export default function OAuthCallback() {
  const router = useRouter()
  const { refetchUser, refetchProfile } = useUser()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          setError('Authentication failed. Redirecting to login...')
          setTimeout(() => router.replace('/auth/login'), 2000)
          return
        }

        if (!session) {
          setError('No session found. Redirecting to login...')
          setTimeout(() => router.replace('/auth/login'), 2000)
          return
        }

        const supabaseToken = session.access_token

        const response = await apiClient().post(
          '/auth/supabaseLogin',
          {},
          { headers: { Authorization: `Bearer ${supabaseToken}` } }
        )

        localStorage.setItem('accessToken', response.data.result.accessToken)
        await Promise.all([refetchUser(), refetchProfile()])

        // UserProvider's useEffect handles navigation to /kyc or /app
        // based on profileStatus. No manual router.push needed here.
      } catch (err: any) {
        setError('Login failed. Redirecting to login...')
        setTimeout(() => router.replace('/auth/login'), 2000)
      }
    }

    handleCallback()
  }, [router, refetchUser, refetchProfile])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-center text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-center">Logging in...</p>
      <div className="mt-4 animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mx-auto"></div>
    </div>
  )
}
