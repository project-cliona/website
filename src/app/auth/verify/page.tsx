'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/axios'
import { useUser } from '@/providers/userProvider'

export default function VerifyEmail() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const email = searchParams.get('email')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [Email, setEmail] = useState("")
    const { refetchUser, refetchProfile } = useUser();
    const sendOtp = async () => {
        try {
            setLoading(true)
            if (email) {
                setEmail(email);
            }
            await apiClient().post('/auth/passwordlesslogin', { email: Email })
            setOtpSent(true)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const verifyOtp = async () => {
        try {
            setLoading(true)
            const response = await apiClient().post('/auth/verifyOTP', {
                email: Email,
                otp
            })
            localStorage.setItem('accessToken', response.data.result.accessToken)
            await Promise.all([refetchUser(), refetchProfile()])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full border rounded-xl p-8 space-y-6">

                {email ? (
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Verify your email</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            We’ve sent an OTP to your email
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Login with your email</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            We’ll an OTP to your email
                        </p>
                    </div>
                )}

                <div className="space-y-1">
                    <Label>Email</Label>
                    <Input value={Email} onChange={(e) => setEmail(e.target.value)}
                        disabled={!!email} />
                </div>

                {/* Send OTP */}
                {!otpSent && (
                    <Button
                        className="w-full"
                        onClick={sendOtp}
                        disabled={loading}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                )}

                {/* OTP Input */}
                {otpSent && (
                    <>
                        <div className="space-y-1">
                            <Label>Enter OTP</Label>
                            <Input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="6-digit OTP"
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={verifyOtp}
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
