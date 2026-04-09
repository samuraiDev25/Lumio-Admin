export type UserBlockedFilter = 'ALL' | 'BLOCKED' | 'NOT_BLOCKED';

export type UserSortBy = 'CREATED_AT_ASC' | 'CREATED_AT_DESC' | 'USERNAME_ASC' | 'USERNAME_DESC';

export type UserProfile = {
  avatarUrl?: string | null;
};

export type UserPostFile = {
  id: string;
  postId: string;
  url: string;
};

export type UserInformationProfile = {
  aboutMe?: string | null;
  accountType: string;
  avatarUrl?: string | null;
  city?: string | null;
  country?: string | null;
  dateOfBirth?: string | null;
  firstName?: string | null;
  id: number;
  lastName?: string | null;
  profileFilled: boolean;
  profileFilledAt?: string | null;
  profileUpdatedAt?: string | null;
};

export type UserItem = {
  createdAt?: string | null;
  email: string;
  id: number;
  isBlocked?: boolean | null;
  profile?: UserProfile | null;
  username: string;
};

export type UserInformationItem = {
  banReason?: string | null;
  bannedAt?: string | null;
  createdAt?: string | null;
  email: string;
  id: number;
  isBlocked?: boolean | null;
  profile?: UserInformationProfile | null;
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

export type GetUserByIdData = {
  user: UserInformationItem | null;
};

export type GetUserByIdVariables = {
  id: number;
};

export type GetUserPostUrlsData = {
  user: {
    files: UserPostFile[];
    id: number;
    username: string;
  } | null;
};

export type GetUserPostUrlsVariables = {
  id: number;
  limit?: number;
  page?: number;
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
