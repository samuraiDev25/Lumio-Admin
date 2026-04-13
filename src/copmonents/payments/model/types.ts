export const SORT_BY = 'DATE_DESC' as const;
export const PAGE_SIZE = 6

export type SortField = 'username' | 'createdAt' | 'amount' | 'subscriptionType';
export type SortOrder = 'ASC' | 'DESC';

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