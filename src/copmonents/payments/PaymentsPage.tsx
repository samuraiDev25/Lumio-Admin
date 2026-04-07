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
import { stringify } from 'querystring';



const SORT_BY = 'DATE_DESC' as const;
const PAGE_SIZE = 6

export type PaymentOutput = {
    amount: number;
    avatarUrl: string;
    username: string;
    subscriptionType: string;
    createdAt: string;
    status: string;
    id: number;
}

export type GetPayments = {
    items: PaymentOutput[];
    page: number;
    pageSize: number;
    pagesCount: number;
    totalCount: number;
}

export type GetPaymentsVariables = {
    pageNumber: number;
    pageSize: number;
    search: string;
    sortBy: typeof SORT_BY;
}

export const PaymentsPage = () => {
    const [searchUserName, setSearchUserName] = useState('');

    const [data, setData] = useState<PaymentOutput[]>([{amount: 1, 
        avatarUrl: '$', 
        createdAt: '21:02:02',  
        id: 1, 
        status: '7 days', 
        subscriptionType: 'Stripe', 
        username: 'Ivan Ivanov'}]);
    const [sortConfig, setSortConfig] = useState<typeof SORT_BY>();

    useEffect(() => {
    // Имитация загрузки данных
        setData([
        { id: 1, 
            username: 'Иван', 
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
};

// const queryVariables = useMemo<GetPaymentsVariables>(
//     () => ({
//         pageNumber: 1,
//         pageSize: PAGE_SIZE,
//         search: searchUserName,
//         sortBy: SORT_BY,
//     }),
//     [searchUserName],
// );

// const { data, error, fetchMore, networkStatus } = useQuery<GetPayments, GetPaymentsVariables>(GET_PAYMENTS, {
//     variables: queryVariables,
//     fetchPolicy: 'cache-and-network',
//     notifyOnNetworkStatusChange: true,
// });
console.log('data of payments:' + data)
    return (
    <div className={s.s}>
        <Checkbox checked={true} onChangeAction={() => {}} label={'Autoupdate'}/>
        <TextField 
            className={s.search}
            iconStart={<Search />}
            onChange={(event) => handleSearchChange(event.currentTarget.value)}
            placeholder="Search"
            value={searchUserName}/>
        <table className={s.s}>
            <thead>
            <tr style={{display: 'flex', borderRadius: '1px solid red'}}>
                <th className={s.s} onClick={() => ('id')}>Full Name ⬍</th>
                <th className={s.s} onClick={() => ('name')}>Date added ⬍</th>
                <th className={s.s} onClick={() => ('email')}>Amount, $ ⬍</th>
                <th className={s.s} onClick={() => ('email')}>Subscription ⬍</th>
                <th className={s.s} onClick={() => ('email')}>Payment Method ⬍</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.id} className={s.s}>
                <td className={s.s}>
                    <div className={s.s}>
                        <img src={item.avatarUrl} className={s.s} />
                        <p className={s.s}>{item.username}</p>
                    </div>
                </td>
                <td className={s.s}>{item.createdAt}</td>
                <td className={s.s}>{item.amount}</td>
                <td className={s.s}>{item.status}</td>
                <td className={s.s}>{item.subscriptionType}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <Pagination totalPages={1} initialPageSize={PAGE_SIZE}/>
    </div>
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