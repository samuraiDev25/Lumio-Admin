import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import '@jstrommash/ui-kit-lumio/styles.css';
import './globals.scss';
import { Header } from '@/copmonents/header/ui';
import { ApolloAppProvider } from '@/lib/apollo/ApolloAppProvider';

export const metadata: Metadata = {
  title: 'Lumio SuperAdmin',
  description: 'Admin panel for users, posts, statistics, and payments.',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <body>
        <ApolloAppProvider>
          <div className="appShell">
            <Header />
            <main className="pageContent">{children}</main>
          </div>
        </ApolloAppProvider>
      </body>
    </html>
  );
}
