'use client'

import s from './PaymentsPage.module.scss'
import { useState } from 'react';
import {
    ArrowIosDownOutline,
    ArrowIosUp,
    Checkbox,
    Pagination,
    Search,
    TextField,
} from '@jstrommash/ui-kit-lumio';
import { PAGE_SIZE, SORT_BY, } from './model/types';
import { usePaymentsApollo } from './hooks/usePaymentsApollo';


export const PaymentsPage = () => {
    const [checked, setChecked] = useState(true)
    const { data: items, handlePageChangeApollo, loading, search, handleSearchChange, handleSort } = usePaymentsApollo();

const handleSearchByName = (name: string) => {
    handleSearchChange(name);
};

const onChangeChacked = () => {
    setChecked(!checked)
}

    if (!loading && !items?.getPayments?.items?.length) {
        <tr>
            <td colSpan={6}>
                No payments found
            </td>
        </tr>
    }

    const paymentsData = items?.getPayments 
    const paymentsList = paymentsData?.items || [];
    const totalPages = paymentsData?.pagesCount || 0;


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
                onChange={(event) => handleSearchByName(event.currentTarget.value)}
                placeholder={"Search by username..."}
                value={search}
            />
        </div>

        <table className={s.table}>
            <thead>
            <tr>
                <th>
                    <button
                    aria-label={`Sort by date`}
                    className={s.sortButton}
                    onClick={()=> handleSort('USERNAME')}
                    type="button"
                                >
                        <span>Full Name</span>
                        <span className={s.sortIcons}>
                            <ArrowIosUp className={s.arrow} />
                            <ArrowIosDownOutline className={s.arrow} />
                        </span>
                    </button>
                </th>
                <th><button
                    aria-label={`Sort by username`}
                    className={s.sortButton}
                    onClick={() => handleSort('DATE')}
                    type="button"
                                >
                        <span>Date added</span>
                        <span className={s.sortIcons}>
                            <ArrowIosUp className={s.arrow} />
                            <ArrowIosDownOutline className={s.arrow} />
                        </span>
                    </button>
                    </th>
                <th>
                    <button
                    aria-label={`Sort by date`}
                    className={s.sortButton}
                    onClick={()=> handleSort('AMOUNT')}
                    type="button"
                                >
                        <span>Amount, $</span>
                        <span className={s.sortIcons}>
                            <ArrowIosUp className={s.arrow} />
                            <ArrowIosDownOutline className={s.arrow} />
                        </span>
                    </button>
                    </th>
                <th >Subscription</th>
                <th>
                    <button
                    aria-label={`Sort by date`}
                    className={s.sortButton}
                    onClick={()=> handleSort('PAYMENT_METHOD')}
                    type="button"
                                >
                        <span>Payment Method</span>
                        <span className={s.sortIcons}>
                            <ArrowIosUp className={s.arrow} />
                            <ArrowIosDownOutline className={s.arrow} />
                        </span>
                    </button>
                    </th>
                <th className={s.actionsColumn} aria-label="Actions" />
            </tr>
            </thead>
            <tbody>
                {!loading && paymentsList.map((item) => (
                <tr key={item.id}>
                <td>
                    <div className={s.fullName}>
                        <img src={item.avatarUrl} className={s.avatar} />
                        <p className={s.username}>{item.username}</p>
                    </div>
                </td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.amount}</td>
                <td>{item.status}</td>
                <td>{item.subscriptionType}</td>
                <td className={s.actionsCell}></td>
                </tr>
            ))}
            </tbody>
        </table>
        {totalPages > 0 && (
        <Pagination 
            totalPages={totalPages} 
            initialPageSize={PAGE_SIZE}
            onPageChange={handlePageChangeApollo}
            initialPage={paymentsData?.page}
        />
        )}
    </section>
    )
}