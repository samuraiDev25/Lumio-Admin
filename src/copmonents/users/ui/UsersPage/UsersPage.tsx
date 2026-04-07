'use client';

import Link from 'next/link';
import {
  ArrowIosDownOutline,
  ArrowIosUp,
  Block,
  CheckmarkOutline,
  MoreHorizontalOutline,
  Pagination,
  PersonRemoveOutline,
  Search,
  TextField,
} from '@jstrommash/ui-kit-lumio';
import { useUsersPage } from '../../hooks';
import { formatDate, formatUserId, getProfileLink, UserBlockedFilter, UserSortBy } from '../../model';
import { BanUserModal, DeleteUserModal, UnBanUserModal } from '..';
import s from './UsersPage.module.scss';
import { clearAccessToken } from '@/shared/lib/auth';
import router from 'next/router';

export const UsersPage = () => {
  const {
    actionsRef,
    banReason,
    banningUser,
    closeBanModal,
    closeDeleteModal,
    closeUnbanModal,
    currentPage,
    deletingUser,
    handleBanUser,
    handleDeleteUser,
    handleMoreInformation,
    handleOpenDeleteModal,
    handleSearchChange,
    handleSortChange,
    handleStatusFilterChange,
    handleToggleBlockedState,
    handleUnbanUser,
    hasError,
    isActionPending,
    loading,
    openedMenuUserId,
    pageSize,
    search,
    searchValue,
    setBanReason,
    setOpenedMenuUserId,
    setPage,
    statusFilter,
    sortBy,
    totalPages,
    userToBan,
    userToDelete,
    userToUnban,
    users,
    unbanningUser,
  } = useUsersPage();

  const handleUsernameSortToggle = () => {
    handleSortChange(sortBy === 'USERNAME_ASC' ? 'USERNAME_DESC' : 'USERNAME_ASC');
  };

  const handleDateSortToggle = () => {
    handleSortChange(sortBy === 'CREATED_AT_DESC' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC');
  };

  const isUsernameSortActive = sortBy === 'USERNAME_ASC' || sortBy === 'USERNAME_DESC';
  const isDateSortActive = sortBy === 'CREATED_AT_ASC' || sortBy === 'CREATED_AT_DESC';
  const usernameSortDirection = sortBy === 'USERNAME_DESC' ? 'desc' : 'asc';
  const dateSortDirection = sortBy === 'CREATED_AT_ASC' ? 'asc' : 'desc';

  if (!loading && hasError) {
    clearAccessToken();
    router.replace('/login');
  }

  return (
    <section className={s.page}>
      <div className={s.toolbar}>
        <TextField
          className={s.search}
          iconStart={<Search />}
          onChange={(event) => handleSearchChange(event.currentTarget.value)}
          placeholder="Search"
          value={search}
        />

        <select
          className={s.select}
          onChange={(event) => handleStatusFilterChange(event.currentTarget.value as UserBlockedFilter)}
          value={statusFilter}
        >
          <option value="ALL">All users</option>
          <option value="BLOCKED">Blocked</option>
          <option value="NOT_BLOCKED">Not blocked</option>
        </select>
      </div>

      <div className={s.tableCard}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>
                <button
                  aria-label={`Sort by username ${usernameSortDirection === 'asc' ? 'descending' : 'ascending'}`}
                  className={s.sortButton}
                  onClick={handleUsernameSortToggle}
                  type="button"
                >
                  <span>Username</span>
                  <span className={s.sortIcons}>
                    <ArrowIosUp className={!isUsernameSortActive || usernameSortDirection === 'asc' ? s.sortIconActive : ''} />
                    <ArrowIosDownOutline
                      className={!isUsernameSortActive || usernameSortDirection === 'desc' ? s.sortIconActive : ''}
                    />
                  </span>
                </button>
              </th>
              <th>Profile link</th>
              <th>
                <button
                  aria-label={`Sort by date added ${dateSortDirection === 'asc' ? 'descending' : 'ascending'}`}
                  className={s.sortButton}
                  onClick={handleDateSortToggle}
                  type="button"
                >
                  <span>Date added</span>
                  <span className={s.sortIcons}>
                    <ArrowIosUp className={!isDateSortActive || dateSortDirection === 'asc' ? s.sortIconActive : ''} />
                    <ArrowIosDownOutline
                      className={!isDateSortActive || dateSortDirection === 'desc' ? s.sortIconActive : ''}
                    />
                  </span>
                </button>
              </th>
              <th>Status</th>
              <th aria-label="Actions" className={s.actionsColumn} />
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

            {!loading && !hasError && users.length === 0 ? (
              <tr>
                <td className={s.stateCell} colSpan={6}>
                  No users found.
                </td>
              </tr>
            ) : null}

            {!loading &&
              !hasError &&
              users.map((user) => (
                <tr key={user.id}>
                  <td>{formatUserId(user.id)}</td>
                  <td>{user.username}</td>
                  <td>
                    <Link className={s.profileLink} href={getProfileLink(user.username)}>
                      {getProfileLink(user.username)}
                    </Link>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td className={s.actionsCell}>
                    <div className={s.actionsWrapper} ref={openedMenuUserId === user.id ? actionsRef : null}>
                      <button
                        aria-expanded={openedMenuUserId === user.id}
                        aria-label={`More actions for ${user.username}`}
                        className={s.moreButton}
                        disabled={isActionPending}
                        onClick={() =>
                          setOpenedMenuUserId((currentUserId) => (currentUserId === user.id ? null : user.id))
                        }
                        type="button"
                      >
                        <span />
                        <span />
                        <span />
                      </button>

                      {openedMenuUserId === user.id ? (
                        <div className={s.actionsMenu} role="menu">
                          <button
                            className={s.menuItem}
                            disabled={isActionPending}
                            onClick={() => handleOpenDeleteModal(user)}
                            role="menuitem"
                            type="button"
                          >
                            <PersonRemoveOutline />
                            <span>Delete User</span>
                          </button>

                          <button
                            className={s.menuItem}
                            disabled={isActionPending}
                            onClick={() => void handleToggleBlockedState(user)}
                            role="menuitem"
                            type="button"
                          >
                            {user.isBlocked ? <CheckmarkOutline /> : <Block />}
                            <span>{user.isBlocked ? 'Unblock User' : 'Ban User'}</span>
                          </button>

                          <button
                            className={s.menuItem}
                            disabled={isActionPending}
                            onClick={handleMoreInformation}
                            role="menuitem"
                            type="button"
                          >
                            <MoreHorizontalOutline />
                            <span>More information</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
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

      <DeleteUserModal
        isLoading={deletingUser}
        onCloseAction={closeDeleteModal}
        onConfirmAction={() => void handleDeleteUser()}
        open={Boolean(userToDelete)}
        username={userToDelete?.username}
      />

      <BanUserModal
        isLoading={banningUser}
        onCloseAction={closeBanModal}
        onConfirmAction={() => void handleBanUser()}
        onReasonChangeAction={setBanReason}
        open={Boolean(userToBan)}
        reason={banReason}
        username={userToBan?.username}
      />

      <UnBanUserModal
        isLoading={unbanningUser}
        onCloseAction={closeUnbanModal}
        onConfirmAction={() => void handleUnbanUser()}
        open={Boolean(userToUnban)}
        username={userToUnban?.username}
      />
    </section>
  );
};
