export type SORT_BY = 'AMOUNT_ASC' | 'AMOUNT_DESC' |
'DATE_ASC' |
'DATE_DESC' |
'PAYMENT_METHOD_ASC' |
'PAYMENT_METHOD_DESC' |
'USERNAME_ASC' |
'USERNAME_DESC';

export const PAGE_SIZE = 6

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
    getPayments: {
        items: PaymentOutput[] ;
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
    sortBy: SORT_BY;
}