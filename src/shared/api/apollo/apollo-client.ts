import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { readAccessToken } from '@/shared/lib/auth';

const graphqlUri =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3003/graphql';

const authLink = setContext((_, previousContext) => {
  const accessToken = readAccessToken();

  return {
    headers: {
      ...previousContext.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    authLink,
    new HttpLink({
      uri: graphqlUri,
    }),
  ]),
});
