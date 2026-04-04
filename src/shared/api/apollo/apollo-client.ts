import { ApolloClient, HttpLink, InMemoryCache, split, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { readAccessToken } from '@/shared/lib/auth';

const graphqlUri =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3003/api/v1/graphql';

const wsUri = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3003/api/v1/graphql';

const authLink = setContext((_, previousContext) => {
  const accessToken = readAccessToken();

  return {
    headers: {
      ...previousContext.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
});

const httpLink = new HttpLink({
  uri: graphqlUri,
});

const httpLinkWithAuth = from([authLink, httpLink]);

const link =
  typeof window === 'undefined'
    ? httpLinkWithAuth
    : split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
          );
        },
        new GraphQLWsLink(
          createClient({
            url: wsUri,
            connectionParams: () => {
              const accessToken = readAccessToken();
              return {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
              };
            },
          }),
        ),
        httpLinkWithAuth,
      );

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
