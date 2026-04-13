// apollo/paymentsApollo.ts
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PAYMENTS } from '@/queries/payments';
import { GetPayments, GetPaymentsVariables, PAGE_SIZE, SORT_BY } from '../model/types';



export const usePaymentsApollo = (
    currentPage: number,
    searchUserName: string,
) => {
    const queryVariables = useMemo<GetPaymentsVariables>(
        () => ({
            pageNumber: currentPage,
            pageSize: PAGE_SIZE,
            search: searchUserName,
            sortBy: SORT_BY,
        }),
        [searchUserName, currentPage]
    );

    const { data, error, fetchMore, networkStatus } = useQuery<GetPayments, GetPaymentsVariables>(
        GET_PAYMENTS,
        {
            variables: queryVariables,
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true,
        }
    );

    const handlePageChangeApollo = (page: number) => {
        fetchMore({
            variables: {
                pageNumber: page,
                pageSize: PAGE_SIZE,
                search: searchUserName,
                sortBy: SORT_BY,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return fetchMoreResult;
            },
        });
    };

    return {
        data,
        error,
        fetchMore,
        networkStatus,
        handlePageChangeApollo,
    };
};