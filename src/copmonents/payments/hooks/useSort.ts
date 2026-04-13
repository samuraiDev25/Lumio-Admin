// hooks/useSort.ts
import { useState } from 'react';
import { SortField, SortOrder } from '../model/types';

export const useSort = (defaultField: SortField = 'createdAt', defaultOrder: SortOrder = 'DESC') => {
    const [sortField, setSortField] = useState<SortField>(defaultField);
    const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortField(field);
            setSortOrder('DESC');
        }
    };

    const getSortIcon = (field: SortField): string => {
        if (sortField !== field) return '⬍';
        return sortOrder === 'ASC' ? '⬆' : '⬇';
    };


    return {
        sortField,
        sortOrder,
        handleSort,
        getSortIcon,
    };
};