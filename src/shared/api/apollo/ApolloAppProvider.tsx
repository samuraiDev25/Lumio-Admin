'use client';

import type { PropsWithChildren } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './apollo-client';

export const ApolloAppProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
