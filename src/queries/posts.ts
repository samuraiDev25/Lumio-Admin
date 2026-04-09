import { gql } from '@apollo/client';

// Запрос для получения постов с пагинацией
export const GET_POSTS = gql`
  query GetPosts($pageNumber: Int = 1, $pageSize: Int = 20, $search: String, $sortBy: PostSortBy = DATE_DESC) {
    getPosts(pageNumber: $pageNumber, pageSize: $pageSize, search: $search, sortBy: $sortBy) {
      items {
        id
        description
        createdAt
        userId
        files {
          url
        }
        user {
          id
          username
        }
      }
      page
      pageSize
      pagesCount
      totalCount
    }
  }
`;

// Подписка на новые посты
export const POST_CREATED_SUBSCRIPTION = gql`
  subscription OnPostCreated {
    postCreated {
      id
      description
      createdAt
      files {
        id
        url
      }
      user {
        id
        #        username
      }
    }
  }
`;
