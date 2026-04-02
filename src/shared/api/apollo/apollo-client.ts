import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { readAccessToken } from '@/shared/lib/auth';

const DEFAULT_GRAPHQL_URI = 'https://admin-api.lumio.su/api/v1/graphql';

const normalizeGraphqlUri = (uri: string) => {
  try {
    const normalizedUrl = new URL(uri);

    normalizedUrl.pathname = normalizedUrl.pathname.replace(/\/+/g, '/');

    if (!normalizedUrl.pathname || normalizedUrl.pathname === '/') {
      normalizedUrl.pathname = '/graphql';
    }

    return normalizedUrl.toString();
  } catch {
    return DEFAULT_GRAPHQL_URI;
  }
};

const graphqlUri = normalizeGraphqlUri(process.env.NEXT_PUBLIC_BASE_API_URL ?? DEFAULT_GRAPHQL_URI);

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
