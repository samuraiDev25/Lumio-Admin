'use client';

import {Pagination} from "@jstrommash/ui-kit-lumio";
import s from "@/copmonents/payments/PaymentsPage.module.scss";
import {useUsersPage} from "@/copmonents/users";

export function UserFollowers() {
    const {
        currentPage,
        loading,
        pageSize,
        searchValue,
        setPage,
        statusFilter,
        sortBy,
        totalPages,
    } = useUsersPage();
    return (
        <section className={s.page}>
            <div className={s.tableCard}>
                <table className={s.table}>
                    <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Profile Link</th>
                        <th>Username</th>
                        <th>Subscription Date</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td className={s.stateCell} colSpan={6}>
                                Loading users...
                            </td>
                        </tr>
                    ) : null}
                    </tbody>
                </table>
            </div>

            <div className={s.pagination}>
                <Pagination
                    key={`${statusFilter}-${sortBy}-${searchValue}-${totalPages}`}
                    initialPage={currentPage}
                    initialPageSize={pageSize}
                    onPageChange={setPage}
                    totalPages={totalPages}
                />
            </div>
        </section>

    )
}