'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { authenticatedApiClient } from '@/lib/axios'

export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // This will parse the URL automatically for OAuth redirect
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Supabase session error:', error)
        return
      }

      if (!session) {
        console.error('No session found')
        return
      }

      const supabaseToken = session.access_token

      // Call your backend API
      try {
        const response = await authenticatedApiClient().post(
          '/auth/supabaseLogin',
          {},
          { headers: { Authorization: `Bearer ${supabaseToken}` } }
        )

        console.log('Login successful:', response.data)
        router.push('http://localhost:3000/app/rcs')
      } catch (err) {
        console.error(err)
      }
    }

    handleCallback()
  }, [router])

  return <p className="text-center mt-20">Logging in...</p>
}
