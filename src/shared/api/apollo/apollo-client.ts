// import { ApolloClient, HttpLink, InMemoryCache, split, from } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { createClient } from 'graphql-ws';
// import { readAccessToken } from '@/shared/lib/auth';
//
// const DEFAULT_GRAPHQL_URI = 'https://admin-api.lumio.su/api/v1/graphql';
//
// const normalizeGraphqlUri = (uri: string) => {
//   try {
//     const normalizedUrl = new URL(uri);
//
//     normalizedUrl.pathname = normalizedUrl.pathname.replace(/\/+/g, '/');
//
//     if (!normalizedUrl.pathname || normalizedUrl.pathname === '/') {
//       normalizedUrl.pathname = '/graphql';
//     }
//
//     return normalizedUrl.toString();
//   } catch {
//     return DEFAULT_GRAPHQL_URI;
//   }
// };
//
// const graphqlUri = normalizeGraphqlUri(process.env.NEXT_PUBLIC_BASE_API_URL ?? DEFAULT_GRAPHQL_URI);
//
// const authLink = setContext((_, previousContext) => {
//   const accessToken = readAccessToken();
//
//   return {
//     headers: {
//       ...previousContext.headers,
//       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//     },
//   };
// });
//
// const httpLink = new HttpLink({
//   uri: graphqlUri,
// });
//
// const httpLinkWithAuth = from([authLink, httpLink]);
//
// const link =
//   typeof window === 'undefined'
//     ? httpLinkWithAuth
//     : split(
//         ({ query }) => {
//           const definition = getMainDefinition(query);
//           return (
//             definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
//           );
//         },
//         new GraphQLWsLink(
//           createClient({
//             url: wsUri,
//             connectionParams: () => {
//               const accessToken = readAccessToken();
//               return {
//                 ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//               };
//             },
//           }),
//         ),
//         httpLinkWithAuth,
//       );
//
// export const apolloClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   link,
// });
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { readAccessToken } from '@/shared/lib/auth';

const DEFAULT_GRAPHQL_URI = 'https://admin-api.lumio.su/api/v1/graphql';

const graphqlUri = process.env.NEXT_PUBLIC_BASE_API_URL ?? process.env.NEXT_PUBLIC_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URI;


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
