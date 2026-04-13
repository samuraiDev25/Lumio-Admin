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
import { useMockDataPayments } from './useMockDataPayments';
import { PAGE_SIZE, } from './model/types';
import { useDebounce } from './hooks/useDebounce';
import { useSort } from './hooks/useSort';
import { usePaymentsApollo } from './hooks/usePaymentsApollo';


export const PaymentsPage = () => {
    const [searchUserName, setSearchUserName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [checked, setChecked] = useState(true)
    const debouncedSearch = useDebounce(searchUserName, 500);
    const { sortField, sortOrder, handleSort, getSortIcon } = useSort('createdAt', 'DESC');
    const data = useMockDataPayments(currentPage, PAGE_SIZE, debouncedSearch, sortField, sortOrder)
    // const { data: items, handlePageChangeApollo } = usePaymentsApollo(currentPage, searchUserName);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

const handleSearchChange = (value: string) => {
    setSearchUserName(value);
};

const onChangeChacked = () => {
    setChecked(!checked)
}

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