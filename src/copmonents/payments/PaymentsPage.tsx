'use client'

import s from './PaymentsPage.module.scss'
import { useEffect, useMemo, useState } from 'react';
import {
    Checkbox,
    Pagination,
    Search,
    TextField,
    Typography,
} from '@jstrommash/ui-kit-lumio';
import { GET_PAYMENTS } from '@/queries/payments';
import { useQuery } from '@apollo/client/react';
import { SortField, SortOrder, useMockDataPayments } from './useMockDataPayments';


const SORT_BY = 'DATE_DESC' as const;
const PAGE_SIZE = 6

export type PaymentOutput = {
    id: number;
    amount: number;
    avatarUrl: string;
    username: string;
    subscriptionType: string;
    createdAt: string;
    status: string;
}

export type GetPayments = {
    payments: {
        items: PaymentOutput[];
        page: number;
        pageSize: number;
        pagesCount: number;
        totalCount: number;
    }
}

export type GetPaymentsVariables = {
    pageNumber: number;
    pageSize: number;
    search: string;
    sortBy: typeof SORT_BY;
}

export const PaymentsPage = () => {
    const [searchUserName, setSearchUserName] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>('createdAt');    
    const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');
    const [checked, setChecked] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchUserName);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchUserName]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const data = useMockDataPayments(currentPage, PAGE_SIZE, debouncedSearch, sortField, sortOrder)
    
// const queryVariables = useMemo<GetPaymentsVariables>(
//     () => ({
//         pageNumber: currentPage,
//         pageSize: PAGE_SIZE,
//         search: searchUserName,
//         sortBy: SORT_BY,
//     }),
//     [searchUserName, currentPage],
// );

// const { data, error, fetchMore, networkStatus } = useQuery<GetPayments, GetPaymentsVariables>(GET_PAYMENTS, {
//     variables: queryVariables,
//     fetchPolicy: 'cache-and-network',
//     notifyOnNetworkStatusChange: true,
// });

// const handlePageChange = (page: number) => {
//   fetchMore({
//     variables: {
//       pageNumber: page,
//       pageSize: PAGE_SIZE,
//       search: searchUserName,
//       sortBy: SORT_BY,
//     },
//     updateQuery: (prev, { fetchMoreResult }) => {
//       if (!fetchMoreResult) return prev;
//       return fetchMoreResult; // Или merge для append
//     }
//   });
// };

const handleSearchChange = (value: string) => {
    setSearchUserName(value);
};

const onChangeChacked = () => {
    setChecked(!checked)
}

const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortField(field);
            setSortOrder('DESC');
        }
        setCurrentPage(1); 
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return '⬍';
        return sortOrder === 'ASC' ? '⬆' : '⬇';
    };

const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

console.log('data of payments:' + data)

    return (
    <section className={s.page}>
        <div className={s.headerControls}>
            <Checkbox 
                checked={checked} 
                onChangeAction={onChangeChacked} 
                label={'Autoupdate'} 
                className={s.checkbox}
            />
            <TextField 
                className={s.search}
                iconStart={<Search />}
                onChange={(event) => handleSearchChange(event.currentTarget.value)}
                placeholder="Search by username..."
                value={searchUserName}
            />
        </div>

        <table className={s.table}>
            <thead>
            <tr>
                <th onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>Full Name {getSortIcon('username')}</th>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>Date added {getSortIcon('createdAt')}</th>
                <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>Amount, $ {getSortIcon('amount')}</th>
                <th >Subscription</th>
                <th onClick={() => handleSort('subscriptionType')} style={{ cursor: 'pointer' }}>Payment Method {getSortIcon('subscriptionType')}</th>
                <th className={s.actionsColumn} aria-label="Actions" />
            </tr>
            </thead>
            <tbody>
            {data?.payments.items.map((item) => (
                <tr key={item.id}>
                <td>
                    <div className={s.fullName}>
                        <img src={item.avatarUrl} className={s.avatar} />
                        <p className={s.username}>{item.username}</p>
                    </div>
                </td>
                <td>{item.createdAt}</td>
                <td>{item.amount}</td>
                <td>{item.status}</td>
                <td>{item.subscriptionType}</td>
                <td className={s.actionsCell}></td>
                </tr>
            ))}
            </tbody>
        </table>
        <Pagination 
            totalPages={data?.payments.pagesCount} 
            initialPageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            initialPage={currentPage}
        />
    </section>
    )
}
