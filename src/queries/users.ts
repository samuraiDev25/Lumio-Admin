import { gql } from '@apollo/client';

export const USER_LIST_ITEM_FRAGMENT = gql`
  fragment UserListItem on User {
    id
    username
    email
    createdAt
    isBlocked
    banReason
    bannedAt
    profile {
      avatarUrl
      city
      country
    }
  }
`;

export const GET_USERS = gql`
  ${USER_LIST_ITEM_FRAGMENT}
  query GetUsers(
    $pageNumber: Int = 1
    $pageSize: Int = 10
    $search: String
    $sortBy: UserSortBy = CREATED_AT_DESC
  ) {
    users(
      pageNumber: $pageNumber
      pageSize: $pageSize
      search: $search
      sortBy: $sortBy
    ) {
      items {
        ...UserListItem
      }
      page
      pageSize
      pagesCount
      totalCount
    }
  }
`;

export const GET_USER_BY_ID = gql`
  ${USER_LIST_ITEM_FRAGMENT}
  query GetUserById($id: Int!) {
    user(id: $id) {
      ...UserListItem
    }
  }
`;
