// apollo/paymentsApollo.ts
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PAYMENTS } from '@/queries/payments';
import { GetPayments, GetPaymentsVariables, PAGE_SIZE, SORT_BY } from '../model/types';
import { useDebounce } from './useDebounce';


export const usePaymentsApollo = () => {
    const [sortBy, setSortBy] = useState<SORT_BY>('DATE_DESC')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleSort = (field: 'DATE' | 'AMOUNT' | 'USERNAME' | 'PAYMENT_METHOD' ) => {
        const descKey = `${field}_DESC` as SORT_BY;
        const ascKey = `${field}_ASC` as SORT_BY;
        const newSortBy = sortBy === descKey ? ascKey : descKey;
        setSortBy(newSortBy)
        return newSortBy
    };

    const handlePageChangeApollo = (page: number) => {
        setPage(page)
    };

    const queryVariables = useMemo<GetPaymentsVariables>(
        () => ({
            pageNumber: page,
            pageSize: PAGE_SIZE,
            search: debouncedSearch,
            sortBy,
        }),
        [debouncedSearch, page, sortBy]
    );

    const { data, error, fetchMore, loading } = useQuery<GetPayments, GetPaymentsVariables>(
        GET_PAYMENTS,
        {
            variables: queryVariables,
        //     variables: {
        //     pageNumber: page,
        //     pageSize: PAGE_SIZE,
        //     search: debouncedSearch,
        //     sortBy,
        // },
            fetchPolicy: 'network-only',
            notifyOnNetworkStatusChange: true,
        }
    );

    return {
        data,
        error,
        fetchMore,
        loading,
        sortBy,
        search,
        handlePageChangeApollo,
        handleSearchChange,
        handleSort,
    };
};