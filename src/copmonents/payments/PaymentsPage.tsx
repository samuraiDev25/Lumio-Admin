'use client'

import { useEffect, useMemo, useState } from 'react';
import s from './PaymentsPage.module.scss'

import {
    Checkbox,
    Pagination,
    Search,
    TextField,
    Typography,
} from '@jstrommash/ui-kit-lumio';
import { GET_PAYMENTS } from '@/queries/payments';
import { useQuery } from '@apollo/client/react';



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
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<typeof SORT_BY>();
    const [checked, setChecked] = useState(true)

    const [data, setData] = useState<PaymentOutput[]>([{
        amount: 1, 
        avatarUrl: '$', 
        createdAt: '21:02:02',  
        id: 1, 
        status: '7 days', 
        subscriptionType: 'Stripe', 
        username: 'Ivan Ivanov'}]);

    useEffect(() => {
    // Имитация загрузки данных
        setData([
        { id: 1, 
            username: 'Ivan Ivanov', 
            amount: 50, 
            subscriptionType: 'Stripe',  
            createdAt: '12.02.02', 
            status: '7 day', 
            avatarUrl: '$',
        },
        ]);
    }, []);

    
const handleSearchChange = (value: string) => {
    setSearchUserName(value);
    setCurrentPage(1);
};

const onChangeChacked = () => {
    setChecked(!checked)
}
// const queryVariables = useMemo<GetPaymentsVariables>(
//     () => ({
//         pageNumber: 1,
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
                placeholder="Search"
                value={searchUserName}
            />
        </div>

        <table className={s.table}>
            <thead>
            <tr>
                <th >Full Name ⬍</th>
                <th >Date added ⬍</th>
                <th >Amount, $ ⬍</th>
                <th >Subscription</th>
                <th >Payment Method ⬍</th>
                <th className={s.actionsColumn} aria-label="Actions" />
            </tr>
            </thead>
            <tbody>
            {data?.map((item) => (
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
            totalPages={1} 
            initialPageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            initialPage={currentPage}
        />
    </section>
    )
}



////////Описание
// Как суперадмин я хочу просмотреть все платежи пользователей платформы.

// Сценарий

// Шаг	Описание	Примечание
// 1	Суперадмин выбирает "Payments list"	

// 2	Система отображает список платежей	Таблица содержит: фото пользователя, username, дату, сумму, подписку, метод оплаты. 
// Отображаются 6 последних записей с пагинацией и поиском по username

// 3	Суперадмин имеет возможность просмотреть большее количество записей в списке Пользователи, 
// используя Пагинацию	На каждой странице по 6 записей

// 4	Суперадмин может сортировать по: username, дате (Date added), сумме (Amount), методу оплаты (Payment Method)

// 5	Суперадмин имеет возможность использовать поисковую строку для поиска по username	