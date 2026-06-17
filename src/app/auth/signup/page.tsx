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
import { Button } from '@/components/ui/Button'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { apiClient } from '@/lib/axios'
import { supabase } from '@/lib/supabase/client'
import { notify } from '@/lib/toast'

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
      setLoading(true)
      await apiClient().post('/auth/signup', {
        username: data.name,
        email: data.email,
        password: data.password
      })
      reset()
      notify.success('Account created! Check your email for the OTP.')
      router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      notify.error(error, 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) notify.error(error.message)
    } catch (err) {
      notify.error(err, 'Could not sign up with Google')
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      panelTitle="Start engaging customers."
      panelSubtitle="Send campaigns, automate replies, and grow with every conversation — across WhatsApp, RCS, and SMS."
      panelTagline="AI-First WhatsApp & RCS Engagement Platform"
    >
      {/* Cross-link under heading */}
      <p className="text-small text-muted-foreground mt-2">
        Have an account?{' '}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Login
        </Link>
      </p>

      {/* OAuth */}
      <div className="mt-8 space-y-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => handleSocialLogin('google')}
          className="w-full justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.3-4.7-50.7H272v95.9h147.1c-6.3 33.8-25 62.5-53.2 81.6v67h85.8c50.1-46.1 79-114.3 79-193.8z" />
            <path fill="#34A853" d="M272 544.3c71.8 0 132.1-23.8 176.1-64.6l-85.8-67c-23.9 16-54.7 25.3-90.3 25.3-69 0-127.5-46.6-148.6-109.3H33.3v68.7c44.1 87.1 135.8 147.9 238.7 147.9z" />
            <path fill="#FBBC05" d="M123.4 322.7c-10.5-31-10.5-64.2 0-95.2V158.8H33.3c-42.8 85.5-42.8 187.2 0 272.7l90.1-68.8z" />
            <path fill="#EA4335" d="M272 107.6c37.4-.6 73.4 13.3 100.6 38.6l75.4-75.4C404.1 25.7 343.8 0 272 0 169.1 0 77.4 60.8 33.3 147.9l90.1 68.7C144.5 154.2 203 107.6 272 107.6z" />
          </svg>
          <span>Continue with Google</span>
        </Button>
      </div>

      {/* OR divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-caption text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input id="name" placeholder="Enter your full name" {...field} />
            )}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input id="email" placeholder="you@company.com" {...field} />
            )}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input id="password" type="password" {...field} />
            )}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input id="confirmPassword" type="password" {...field} />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="mt-0.5"
              />
            )}
          />
          <Label className="text-sm leading-snug font-normal">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        {errors.terms && (
          <p className="text-xs text-destructive">{errors.terms.message}</p>
        )}

        <Button type="submit" loading={loading} disabled={loading} className="w-full" size="lg">
          {loading ? 'Creating account...' : 'Signup'}
        </Button>
      </form>
    </AuthLayout>
  )
}
