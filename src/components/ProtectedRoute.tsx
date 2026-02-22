'use client';
import { useUser } from '@/providers/userProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userAuthLoading } = useUser();
  const router = useRouter();

  // Redirect immediately if no token exists (catches Next.js router cache restores)
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.replace('/auth/login');
    }
  }, [router]);

  // Handle browser back button after logout via bfcache (Back/Forward Cache).
  // bfcache freezes the entire JS heap and restores it without re-running effects,
  // so the only reliable hook is the 'pageshow' event with event.persisted === true.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !localStorage.getItem('accessToken')) {
        router.replace('/auth/login');
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [router]);

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
