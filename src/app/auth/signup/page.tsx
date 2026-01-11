'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupForm } from '@/lib/schema/common.schema'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Checkbox } from '@/components/ui/checkbox'
import { authenticatedApiClient } from '@/lib/axios'
import { supabase } from '@/lib/supabase/client'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  })

  const onSubmit = async (data: SignupForm) => {
    try {
      setLoading(true);
      const response = await authenticatedApiClient().post('/auth/signup', {
        username: data.name,
        email: data.email,
        password: data.password
      })
      reset()
      router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Social login error:', error.message)
        return
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <h1 className="text-3xl font-semibold">Cliona</h1>
          </Link>
          <p className="mt-2 text-muted-foreground">CPaaS Platform</p>
        </div>

        {/* Form */}
        <div className="border rounded-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input id="name" placeholder="Enter your full name" {...field} />
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email Address *</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input id="email" placeholder="Enter your email" {...field} />
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password *</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input id="password" type="password" {...field} />
                )}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input id="confirmPassword" type="password" {...field} />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true)
                    }}
                  />
                )}
              />
              <Label className="text-sm leading-snug">
                I agree to the Terms & Privacy Policy
              </Label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-600">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 mb-3">Or sign up with</p>
            <div className="flex justify-center gap-4">

              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 shadow-sm"
              >
                {/* Google logo */}
                <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.3-4.7-50.7H272v95.9h147.1c-6.3 33.8-25 62.5-53.2 81.6v67h85.8c50.1-46.1 79-114.3 79-193.8z" />
                  <path fill="#34A853" d="M272 544.3c71.8 0 132.1-23.8 176.1-64.6l-85.8-67c-23.9 16-54.7 25.3-90.3 25.3-69 0-127.5-46.6-148.6-109.3H33.3v68.7c44.1 87.1 135.8 147.9 238.7 147.9z" />
                  <path fill="#FBBC05" d="M123.4 322.7c-10.5-31-10.5-64.2 0-95.2V158.8H33.3c-42.8 85.5-42.8 187.2 0 272.7l90.1-68.8z" />
                  <path fill="#EA4335" d="M272 107.6c37.4-.6 73.4 13.3 100.6 38.6l75.4-75.4C404.1 25.7 343.8 0 272 0 169.1 0 77.4 60.8 33.3 147.9l90.1 68.7C144.5 154.2 203 107.6 272 107.6z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
