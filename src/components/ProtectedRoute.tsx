'use client';
import { useUser } from '@/providers/userProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userAuthLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userAuthLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, userAuthLoading, router]);

  if (userAuthLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-4 text-gray-700">Loading...</p>
          <div className="animate-spin h-8 w-8 border-4 border-gray-400 border-t-gray-900 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
