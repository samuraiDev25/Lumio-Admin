'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_EVENT_NAME, isAuthenticated } from '@/shared/lib/auth';

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const syncAuthorization = () => {
      const authorized = isAuthenticated();

      setIsAuthorized(authorized);

      if (!authorized && pathname !== '/login') {
        router.replace('/login');
      }
    };

    syncAuthorization();

    window.addEventListener('storage', syncAuthorization);
    window.addEventListener(AUTH_EVENT_NAME, syncAuthorization);

    return () => {
      window.removeEventListener('storage', syncAuthorization);
      window.removeEventListener(AUTH_EVENT_NAME, syncAuthorization);
    };
  }, [pathname, router]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
