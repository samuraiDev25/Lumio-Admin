'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { BAN_USER, DELETE_USER, GET_USERS, UNBAN_USER } from '@/queries/users';
import { clearAccessToken, readAccessToken } from '@/shared/lib/auth';
import { BAN_REASONS, BanReason, PAGE_SIZE } from '../model/constants';
import {
  BanUserData,
  BanUserVariables,
  DeleteUserData,
  DeleteUserVariables,
  GetUsersData,
  GetUsersVariables,
  UnbanUserData,
  UnbanUserVariables,
  UserBlockedFilter,
  UserItem,
} from '../model/types';

export const useUsersPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserBlockedFilter>('NOT_BLOCKED');
  const [openedMenuUserId, setOpenedMenuUserId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [userToBan, setUserToBan] = useState<UserItem | null>(null);
  const [banReason, setBanReason] = useState<BanReason>(BAN_REASONS[0]);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const searchValue = search.trim();
  const accessToken = readAccessToken();
  const hasAccessToken = Boolean(accessToken);
  const { data, error, loading, refetch } = useQuery<GetUsersData, GetUsersVariables>(GET_USERS, {
    notifyOnNetworkStatusChange: true,
    skip: !hasAccessToken,
    variables: {
      blockedFilter: statusFilter,
      pageNumber: page,
      pageSize: PAGE_SIZE,
      ...(searchValue ? { search: searchValue } : {}),
    },
  });
  const [deleteUserMutation, { loading: deletingUser }] = useMutation<DeleteUserData, DeleteUserVariables>(DELETE_USER);
  const [banUserMutation, { loading: banningUser }] = useMutation<BanUserData, BanUserVariables>(BAN_USER);
  const [unbanUserMutation, { loading: unbanningUser }] = useMutation<UnbanUserData, UnbanUserVariables>(UNBAN_USER);

  const users = data?.users.items ?? [];
  const totalPages = Math.max(1, data?.users.pagesCount ?? 1);
  const currentPage = data?.users.page ?? page;
  const isActionPending = deletingUser || banningUser || unbanningUser;
  const hasError = Boolean(error);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setOpenedMenuUserId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!hasAccessToken) {
      router.replace('/login');
    }
  }, [hasAccessToken, router]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: UserBlockedFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const closeActionsMenu = () => setOpenedMenuUserId(null);

  const closeDeleteModal = () => setUserToDelete(null);

  const closeBanModal = () => {
    setUserToBan(null);
    setBanReason(BAN_REASONS[0]);
  };

  const handleOpenDeleteModal = (user: UserItem) => {
    setUserToDelete(user);
    closeActionsMenu();
  };

  const handleOpenBanModal = (user: UserItem) => {
    setUserToBan(user);
    setBanReason(BAN_REASONS[0]);
    closeActionsMenu();
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    await deleteUserMutation({
      variables: {
        id: userToDelete.id,
      },
    });

    await refetch();
    closeDeleteModal();
  };

  const handleBanUser = async () => {
    if (!userToBan) {
      return;
    }

    await banUserMutation({
      variables: {
        banReason,
        id: userToBan.id,
      },
    });

    await refetch();
    closeBanModal();
  };

  const handleToggleBlockedState = async (user: UserItem) => {
    if (user.isBlocked) {
      await unbanUserMutation({
        variables: {
          id: user.id,
        },
      });

      await refetch();
      closeActionsMenu();

      return;
    }

    handleOpenBanModal(user);
  };

  const handleReturnToLogin = () => {
    clearAccessToken();
    router.replace('/login');
  };

  const handleMoreInformation = () => {
    router.replace('/user/id');
  };

  return {
    actionsRef,
    banReason,
    currentPage,
    deletingUser,
    handleBanUser,
    handleDeleteUser,
    handleMoreInformation,
    handleOpenDeleteModal,
    handleReturnToLogin,
    handleSearchChange,
    handleStatusFilterChange,
    handleToggleBlockedState,
    hasError,
    isActionPending,
    loading,
    openedMenuUserId,
    pageSize: PAGE_SIZE,
    search,
    searchValue,
    setBanReason,
    setOpenedMenuUserId,
    setPage,
    statusFilter,
    totalPages,
    userToBan,
    userToDelete,
    users,
    banningUser,
    closeBanModal,
    closeDeleteModal,
  };
};
