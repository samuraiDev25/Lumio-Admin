import { gql } from '@apollo/client';

export const GET_PAYMENTS = gql`
  query GetPayments(
    $pageNumber: Int = 1
    $pageSize: Int = 6
    $search: String
    $sortBy: PaymentSortBy = DATE_DESC
  ) {
    getPayments(
      pageNumber: $pageNumber
      pageSize: $pageSize
      search: $search
      sortBy: $sortBy
    ) {
      items {
        amount
        avatarUrl
        username
        subscriptionType
        createdAt
        status
      }
      page
      pageSize
      pagesCount
      totalCount
    }
  }
`;