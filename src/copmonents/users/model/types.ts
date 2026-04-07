export type UserBlockedFilter = 'ALL' | 'BLOCKED' | 'NOT_BLOCKED';

export type UserSortBy = 'CREATED_AT_ASC' | 'CREATED_AT_DESC' | 'USERNAME_ASC' | 'USERNAME_DESC';

export type UserProfile = {
  avatarUrl?: string | null;
};

export type UserItem = {
  createdAt?: string | null;
  email: string;
  id: number;
  isBlocked?: boolean | null;
  profile?: UserProfile | null;
  username: string;
};

export type GetUsersData = {
  users: {
    items: UserItem[];
    page: number;
    pageSize: number;
    pagesCount: number;
    totalCount: number;
  };
};

export type GetUsersVariables = {
  blockedFilter: UserBlockedFilter;
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: UserSortBy;
};

export type DeleteUserData = {
  deleteUser: boolean;
};

export type DeleteUserVariables = {
  id: number;
};

export type BanUserData = {
  banUser: boolean;
};

export type BanUserVariables = {
  banReason: string;
  id: number;
};

export type UnbanUserData = {
  unbanUser: boolean;
};

export type UnbanUserVariables = {
  id: number;
};
