import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { SetContextLink } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { readAccessToken } from '@/shared/lib/auth';
import { createClient } from 'graphql-ws';

const DEFAULT_GRAPHQL_URI = 'https://admin-api.lumio.su/api/v1/graphql';

const normalizeGraphqlUri = (uri: string) => {
  try {
    return new URL(uri).toString();
  } catch {
    return DEFAULT_GRAPHQL_URI;
  }
};

const getWsUri = (uri: string) => {
  try {
    const wsUrl = new URL(uri);

    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';

    return wsUrl.toString();
  } catch {
    return DEFAULT_GRAPHQL_URI.replace(/^http/, 'ws');
  }
};

const graphqlUri = normalizeGraphqlUri(
  process.env.NEXT_PUBLIC_BASE_API_URL ?? process.env.NEXT_PUBLIC_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URI,
);
const wsUri = getWsUri(graphqlUri);

const authLink = new SetContextLink((prevContext) => {
  const accessToken = readAccessToken();

  return {
    headers: {
      ...prevContext.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
});

const httpLink = new HttpLink({
  uri: graphqlUri,
});

const httpLinkWithAuth = ApolloLink.from([authLink, httpLink]);

const link =
  typeof window === 'undefined'
    ? httpLinkWithAuth
    : ApolloLink.split(
        ({ query }) => {
          const definition = getMainDefinition(query);

          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
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
