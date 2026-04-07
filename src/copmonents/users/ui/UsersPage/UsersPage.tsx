'use client';

import Link from 'next/link';
import {
  Block,
  CheckmarkOutline,
  MoreHorizontalOutline,
  Pagination,
  PersonRemoveOutline,
  Search,
  TextField,
} from '@jstrommash/ui-kit-lumio';
import { useUsersPage } from '../../hooks';
import { formatDate, formatUserId, getProfileLink, UserBlockedFilter } from '../../model';
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
    totalPages,
    userToBan,
    userToDelete,
    userToUnban,
    users,
    unbanningUser,
  } = useUsersPage();

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
              <th>Username</th>
              <th>Profile link</th>
              <th>Date added</th>
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
          key={`${statusFilter}-${searchValue}-${totalPages}`}
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
