import { gql } from '@apollo/client';

export const USER_LIST_ITEM_FRAGMENT = gql`
  fragment UserListItem on User {
    id
    username
    email
    createdAt
    isBlocked
    profile {
      avatarUrl
    }
  }
`;

export const GET_USERS = gql`
  ${USER_LIST_ITEM_FRAGMENT}
  query GetUsers(
    $pageNumber: Int = 1
    $pageSize: Int = 8
    $blockedFilter: UserBlockedFilter = ALL
    $search: String
    $sortBy: UserSortBy = CREATED_AT_DESC
  ) {
    users(
      blockedFilter: $blockedFilter
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
  query GetUserById($id: Int!) {
    user(id: $id) {
      id
      username
      email
      createdAt
      isBlocked
      banReason
      bannedAt
      profile {
        id
        aboutMe
        accountType
        avatarUrl
        city
        country
        dateOfBirth
        firstName
        lastName
        profileFilled
        profileFilledAt
        profileUpdatedAt
      }
    }
  }
`;

export const GET_USER_POST_URLS = gql`
  query GetUserPostUrls($id: Int!, $page: Int = 1, $limit: Int = 8) {
    user(id: $id) {
      id
      username
      files(page: $page, limit: $limit, sortBy: DATE_DESC) {
        id
        postId
        url
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

export const BAN_USER = gql`
  mutation BanUser($id: Int!, $banReason: String!) {
    banUser(id: $id, banReason: $banReason)
  }
`;

export const UNBAN_USER = gql`
  mutation UnbanUser($id: Int!) {
    unbanUser(id: $id)
  }
`;
