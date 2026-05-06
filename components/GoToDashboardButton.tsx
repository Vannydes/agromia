'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

/**
 * Button that intelligently routes to dashboard if logged in,
 * or to login page if not authenticated
 */
export function GoToDashboardButton() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      // User is logged in - go to dashboard
      router.push('/dashboard');
    } else {
      // User is not logged in - go to login
      router.push('/login');
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? 'Caricamento...' : 'Vai alla dashboard'}
    </Button>
  );
}