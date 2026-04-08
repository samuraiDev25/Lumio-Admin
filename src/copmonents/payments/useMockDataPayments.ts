
// useMockDataPayments.ts
import { GetPayments, PaymentOutput } from './PaymentsPage';

export type SortField = 'username' | 'createdAt' | 'amount' | 'subscriptionType';
export type SortOrder = 'ASC' | 'DESC';

const MOCK_PAYMENTS: PaymentOutput[] = [
    { amount: 1, 
        avatarUrl: 'https://i.pravatar.cc/150?img=1', 
        createdAt: '21:02:02', 
        id: 1, 
        status: '7 days', 
        subscriptionType: 'Stripe', 
        username: 'Elena Light' },

    { amount: 3, 
        avatarUrl: 'https://i.pravatar.cc/150?img=2', 
        createdAt: '05:03:12', 
        id: 2, 
        status: '1 day', 
        subscriptionType: 'Paypline', 
        username: 'Yuliya Smile' },

    { amount: 5, 
        avatarUrl: 'https://i.pravatar.cc/150?img=3', 
        createdAt: '13:05:23', 
        id: 3, 
        status: '2 days', 
        subscriptionType: 'Stripe', 
        username: 'Roman Strong' },

    { amount: 10, 
        avatarUrl: 'https://i.pravatar.cc/150?img=4', 
        createdAt: '30:08:13', 
        id: 4, 
        status: '5 days', 
        subscriptionType: 'Paypline', 
        username: 'Ilya Cool' },

    { amount: 7, 
        avatarUrl: 'https://i.pravatar.cc/150?img=5', 
        createdAt: '22:09:20', 
        id: 5, 
        status: '3 days', 
        subscriptionType: 'Stripe', 
        username: 'Tanya Boss' },

    { amount: 13, 
        avatarUrl: 'https://i.pravatar.cc/150?img=6', 
        createdAt: '27:01:19', 
        id: 6, 
        status: '4 days', 
        subscriptionType: 'Paypline', 
        username: 'Stepan Wizard' },

    { amount: 9, 
        avatarUrl: 'https://i.pravatar.cc/150?img=7', 
        createdAt: '15:06:23', 
        id: 7, 
        status: '9 days', 
        subscriptionType: 'Paypline', 
        username: 'Vitaliy Metal' },

    { amount: 11, 
        avatarUrl: 'https://i.pravatar.cc/150?img=8', 
        createdAt: '18:01:25', 
        id: 8, 
        status: '11 days', 
        subscriptionType: 'Stripe', 
        username: 'Klim Dark' },
];

const sortPayments = (items: PaymentOutput[], sortField: SortField, sortOrder: SortOrder): PaymentOutput[] => {
    return [...items].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];
        
        if (sortField === 'amount') {
            aValue = Number(aValue);
            bValue = Number(bValue);
        }
        
        if (sortField === 'createdAt') {
            aValue = aValue.split(':').join('');
            bValue = bValue.split(':').join('');
        }
        
        if (sortOrder === 'ASC') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
};

export const useMockDataPayments = (
    pageNumber: number, 
    pageSize: number, 
    searchTerm: string,
    sortField: SortField,
    sortOrder: SortOrder
): GetPayments => {

    let filteredPayments = MOCK_PAYMENTS.filter(payment => 
        payment.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredPayments = sortPayments(filteredPayments, sortField, sortOrder);
    
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filteredPayments.slice(startIndex, endIndex);
    
    return {
        payments: {
            items: paginatedItems,
            page: pageNumber,
            pageSize: pageSize,
            pagesCount: Math.ceil(filteredPayments.length / pageSize),
            totalCount: filteredPayments.length,
        }
    };
};