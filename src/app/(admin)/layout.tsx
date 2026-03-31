import type { PropsWithChildren } from 'react';
import Navbar from '@/ widgets/NavBar';
import { AuthGuard } from '@/features/auth/ui/AuthGuard';

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <div className="adminLayout">
        <Navbar />
        <div className="adminContent">{children}</div>
      </div>
    </AuthGuard>
  );
}
