'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Block,
  MoreHorizontalOutline,
  Pagination,
  PersonRemoveOutline,
  Search,
  TextField,
} from '@jstrommash/ui-kit-lumio';
import { GET_USERS } from '@/queries/users';
import s from './UsersPage.module.scss';

type UserProfile = {
  avatarUrl?: string | null;
  city?: string | null;
  country?: string | null;
};

type UserItem = {
  banReason?: string | null;
  bannedAt?: string | null;
  createdAt?: string | null;
  email: string;
  id: number;
  isBlocked?: boolean | null;
  profile?: UserProfile | null;
  username: string;
};

type GetUsersData = {
  users: {
    items: UserItem[];
    page: number;
    pageSize: number;
    pagesCount: number;
    totalCount: number;
  };
};

type GetUsersVariables = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'CREATED_AT_DESC';
};

const PAGE_SIZE = 10;


export const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'blocked' | 'notBlocked'>('notBlocked');
  const [openedMenuUserId, setOpenedMenuUserId] = useState<number | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  const { data, loading, error } = useQuery<GetUsersData, GetUsersVariables>(GET_USERS, {
    variables: {
      pageNumber: page,
      pageSize: PAGE_SIZE,
      search: search.trim() || undefined,
      sortBy: 'CREATED_AT_DESC',
    },
  });

  const users = useMemo(() => {
    const items = data?.users.items ?? [];

    if (statusFilter === 'blocked') {
      return items.filter(user => Boolean(user.isBlocked));
    }

    if (statusFilter === 'notBlocked') {
      return items.filter(user => !user.isBlocked);
    }

    return items;
  }, [data?.users.items, statusFilter]);

  const totalPages = data?.users.pagesCount ?? 1;

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

  return (
    <section className={s.page}>
      <div className={s.toolbar}>
        <TextField
          className={s.search}
          iconStart={<Search />}
          onChange={event => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
          placeholder="Search"
          value={search}
        />

        <select
          className={s.select}
          onChange={event => setStatusFilter(event.currentTarget.value as 'blocked' | 'notBlocked')}
          value={statusFilter}
        >
          <option value="blocked">Blocked</option>
          <option value="notBlocked">Not blocked</option>
        </select>
      </div>

      <div className={s.tableCard}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Status</th>
              <th>Date added</th>
              <th className={s.actionsColumn} aria-label="Actions" />
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

            {!loading && error ? (
              <tr>
                <td className={s.stateCell} colSpan={6}>
                  Failed to load users.
                </td>
              </tr>
            ) : null}

            {!loading && !error && users.length === 0 ? (
              <tr>
                <td className={s.stateCell} colSpan={6}>
                  No users found.
                </td>
              </tr>
            ) : null}

            {!loading && !error
              ? users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id.toString().padStart(2, '0')}</td>
                    <td>{user.username}</td>
                    <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                    <td>{user.createdAt}</td>
                    <td className={s.actionsCell}>
                      <div className={s.actionsWrapper} ref={openedMenuUserId === user.id ? actionsRef : null}>
                        <button
                          aria-expanded={openedMenuUserId === user.id}
                          aria-label={`More actions for ${user.username}`}
                          className={s.moreButton}
                          onClick={() =>
                            setOpenedMenuUserId(currentUserId => (currentUserId === user.id ? null : user.id))
                          }
                          type="button"
                        >
                          <span />
                          <span />
                          <span />
                        </button>

                        {openedMenuUserId === user.id ? (
                          <div className={s.actionsMenu} role="menu">
                            <button className={s.menuItem} role="menuitem" type="button">
                              <PersonRemoveOutline />
                              <span>Delete User</span>
                            </button>

                            <button className={s.menuItem} role="menuitem" type="button">
                              <Block />
                              <span>Ban in the system</span>
                            </button>

                            <button className={s.menuItem} role="menuitem" type="button">
                              <MoreHorizontalOutline />
                              <span>More Information</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className={s.pagination}>
        <Pagination
          initialPage={page}
          initialPageSize={PAGE_SIZE}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
};
