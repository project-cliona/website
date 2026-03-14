'use client';

import { useState } from 'react';
import { useUser } from '@/providers/userProvider';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const { logout } = useUser();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      {loading ? 'Signing out...' : (children ?? 'Sign Out')}
    </button>
  );
}
