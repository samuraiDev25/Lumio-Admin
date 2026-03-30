import type { PropsWithChildren } from 'react';
import Navbar from '@/copmonents/NavBar';

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="adminLayout">
      <Navbar />
      <div className="adminContent">{children}</div>
    </div>
  );
}
