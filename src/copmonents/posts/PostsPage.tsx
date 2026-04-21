'use client';

import { NetworkStatus } from '@apollo/client';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client/react';
import { Block, CheckmarkOutline, Search, TextField } from '@jstrommash/ui-kit-lumio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { BanUserModal, UnBanUserModal } from '@/copmonents/users';
import {
  BAN_REASONS,
  BanReason,
  BanUserData,
  BanUserVariables,
  GetUserByIdData,
  GetUserByIdVariables,
  UnbanUserData,
  UnbanUserVariables,
} from '@/copmonents/users/model';
import { GET_POSTS, POST_CREATED_SUBSCRIPTION } from '@/queries/posts';
import { BAN_USER, GET_USER_BY_ID, UNBAN_USER } from '@/queries/users';

import s from './PostsPage.module.scss';

const PAGE_SIZE = 20;
const SORT_BY = 'DATE_DESC' as const;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }

  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

type PostFile = { url?: string | null };

type PostUser = {
  id?: string | number | null;
  isBlocked?: boolean | null;
  profile?: {
    avatarUrl?: string | null;
  } | null;
  username?: string | null;
};

type PostItem = {
  createdAt: string;
  description?: string | null;
  files?: PostFile[] | null;
  id: string | number;
  user?: PostUser | null;
  userId?: string | number | null;
};

type GetPostsData = {
  getPosts: {
    items: PostItem[];
    page: number;
    pageSize: number;
    pagesCount: number;
    totalCount: number;
  };
};

type GetPostsVariables = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy: typeof SORT_BY;
};

type PostCreatedPayload = {
  createdAt: string;
  description?: string | null;
  files?: { id?: string; url?: string | null }[] | null;
  id: string | number;
  user?: PostUser | null;
};

type PostCreatedSubscriptionData = {
  postCreated: PostCreatedPayload;
};

export const PostsPage = () => {
  const client = useApolloClient();
  const [searchInput, setSearchInput] = useState('');
  const [banReason, setBanReason] = useState<BanReason>(BAN_REASONS[0]);
  const [userToBan, setUserToBan] = useState<PostUser | null>(null);
  const [userToUnban, setUserToUnban] = useState<PostUser | null>(null);
  const debouncedSearch = useDebouncedValue(searchInput, 500);
  const [banUserMutation, { loading: banningUser }] = useMutation<BanUserData, BanUserVariables>(BAN_USER);
  const [unbanUserMutation, { loading: unbanningUser }] = useMutation<UnbanUserData, UnbanUserVariables>(UNBAN_USER);

  const searchParam = debouncedSearch.trim() || undefined;

  const queryVariables = useMemo<GetPostsVariables>(
    () => ({
      pageNumber: 1,
      pageSize: PAGE_SIZE,
      search: searchParam,
      sortBy: SORT_BY,
    }),
    [searchParam],
  );

  const variablesRef = useRef(queryVariables);

  useEffect(() => {
    variablesRef.current = queryVariables;
  }, [queryVariables]);

  const { data, error, fetchMore, networkStatus } = useQuery<GetPostsData, GetPostsVariables>(GET_POSTS, {
    variables: queryVariables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useSubscription<PostCreatedSubscriptionData>(POST_CREATED_SUBSCRIPTION, {
    onData: ({ data: subResult }) => {
      const created = subResult.data?.postCreated;

      if (!created) {
        return;
      }

      void (async () => {
        const { pageSize, search, sortBy } = variablesRef.current;
        const authorId = Number(created.user?.id);
        let postUser = created.user ?? null;

        if (!Number.isNaN(authorId)) {
          try {
            const { data: authorData } = await client.query<GetUserByIdData, GetUserByIdVariables>({
              query: GET_USER_BY_ID,
              variables: { id: authorId },
              fetchPolicy: 'network-only',
            });

            if (authorData?.user) {
              postUser = {
                id: authorData.user.id,
                isBlocked: authorData.user.isBlocked,
                profile: {
                  avatarUrl: authorData.user.profile?.avatarUrl,
                },
                username: authorData.user.username,
              };
            }
          } catch {
            postUser = created.user ?? null;
          }
        }

        const term = search?.trim().toLowerCase() ?? '';
        if (term && !postUser?.username?.toLowerCase().includes(term)) {
          return;
        }

        const item: PostItem = {
          id: created.id,
          description: created.description,
          createdAt: created.createdAt,
          userId: postUser?.id,
          files: (created.files ?? []).map(file => ({ url: file.url })),
          user: postUser,
        };

      client.cache.updateQuery<GetPostsData | null, GetPostsVariables>(
        {
          query: GET_POSTS,
          variables: {
            pageNumber: 1,
            pageSize,
            search: search || undefined,
            sortBy,
          },
        },
        existing => {
          if (!existing?.getPosts) {
            return existing;
          }

          const exists = existing.getPosts.items.some(p => String(p.id) === String(item.id));
          if (exists) {
            return existing;
          }

            return {
              getPosts: {
                ...existing.getPosts,
                items: [item, ...existing.getPosts.items],
                totalCount: existing.getPosts.totalCount + 1,
              },
            };
          },
        );
      })();
    },
  });

  const updateBlockedStateInCache = useCallback(
    (userId: string, isBlocked: boolean) => {
      const { pageSize, search, sortBy } = variablesRef.current;

      client.cache.updateQuery<GetPostsData | null, GetPostsVariables>(
        {
          query: GET_POSTS,
          variables: {
            pageNumber: 1,
            pageSize,
            search: search || undefined,
            sortBy,
          },
        },
        existing => {
          if (!existing?.getPosts) {
            return existing;
          }

          return {
            getPosts: {
              ...existing.getPosts,
              items: existing.getPosts.items.map(post =>
                String(post.user?.id) === userId
                  ? {
                      ...post,
                      user: post.user
                        ? {
                            ...post.user,
                            isBlocked,
                          }
                        : post.user,
                    }
                  : post,
              ),
            },
          };
        },
      );
    },
    [client],
  );

  const handleToggleBlockedState = (user: PostUser) => {
    if (user.isBlocked) {
      setUserToUnban(user);
      return;
    }

    setUserToBan(user);
    setBanReason(BAN_REASONS[0]);
  };

  const closeBanModal = () => {
    setUserToBan(null);
    setBanReason(BAN_REASONS[0]);
  };

  const closeUnbanModal = () => setUserToUnban(null);

  const handleBanUser = async () => {
    const userId = Number(userToBan?.id);

    if (!userToBan || Number.isNaN(userId)) {
      return;
    }

    await banUserMutation({
      variables: {
        banReason,
        id: userId,
      },
    });

    updateBlockedStateInCache(String(userId), true);
    closeBanModal();
  };

  const handleUnbanUser = async () => {
    const userId = Number(userToUnban?.id);

    if (!userToUnban || Number.isNaN(userId)) {
      return;
    }

    await unbanUserMutation({
      variables: {
        id: userId,
      },
    });

    updateBlockedStateInCache(String(userId), false);
    closeUnbanModal();
  };

  const posts = data?.getPosts.items ?? [];
  const pageInfo = data?.getPosts;
  const isActionPending = banningUser || unbanningUser;
  const hasMore = pageInfo ? pageInfo.page < pageInfo.pagesCount : false;

  const loadMore = useCallback(() => {
    if (!pageInfo || networkStatus === NetworkStatus.fetchMore) {
      return;
    }

    if (pageInfo.page >= pageInfo.pagesCount) {
      return;
    }

    const nextPage = pageInfo.page + 1;

    void fetchMore({
      variables: {
        pageNumber: nextPage,
        pageSize: PAGE_SIZE,
        search: searchParam,
        sortBy: SORT_BY,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getPosts) {
          return prev;
        }

        return {
          getPosts: {
            ...fetchMoreResult.getPosts,
            items: [...(prev.getPosts?.items ?? []), ...fetchMoreResult.getPosts.items],
          },
        };
      },
    });
  }, [fetchMore, networkStatus, pageInfo, searchParam]);

  const { ref: sentinelRef, inView } = useInView({ rootMargin: '200px', threshold: 0 });

  useEffect(() => {
    if (inView && hasMore && networkStatus !== NetworkStatus.fetchMore) {
      loadMore();
    }
  }, [hasMore, inView, loadMore, networkStatus]);

  const isInitialLoading = networkStatus === NetworkStatus.loading && !pageInfo;
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  return (
    <section className={`adminSection ${s.page}`}>

      <div className={s.toolbar}>
        <TextField
          className={s.search}
          iconStart={<Search />}
          onChange={event => setSearchInput(event.currentTarget.value)}
          placeholder="Search"
          value={searchInput}
        />
      </div>

      {isInitialLoading ? <div className={s.state}>Loading posts…</div> : null}

      {!isInitialLoading && error ? <div className={s.state}>Failed to load posts.</div> : null}

      {!isInitialLoading && !error && posts.length === 0 ? (
        <div className={s.state}>No posts found.</div>
      ) : null}

      {!isInitialLoading && !error && posts.length > 0 ? (
        <div className={s.list}>
          {posts.map(post => {
            const imageUrl = post.files?.[0]?.url;
            const avatarUrl = post.user?.profile?.avatarUrl;
            const avatarLabel = (post.user?.username ?? '?').slice(0, 2).toUpperCase();

            return (
              <article className={s.card} key={String(post.id)}>
                <div className={s.thumb}>
                  {/* Post media URLs come from the API; domains are not fixed at build time. */}
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote post URLs from GraphQL
                    <img alt="" src={imageUrl} />
                  ) : null}
                </div>

                <div className={s.body}>
                  <div className={s.userHead}>
                    <div className={s.userInfo}>
                      <div className={s.avatar}>
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- remote avatar URL from GraphQL
                          <img alt="" src={avatarUrl} />
                        ) : (
                          <span className={s.avatarFallback}>{avatarLabel}</span>
                        )}
                      </div>
                      <span className={s.username}>{post.user?.username ?? '-'}</span>
                    </div>

                    <button
                      className={s.banUser}
                      disabled={isActionPending || !post.user?.id}
                      onClick={() => post.user && handleToggleBlockedState(post.user)}
                      type="button"
                    >
                      {post.user?.isBlocked ? <CheckmarkOutline /> : <Block />}
                    </button>
                  </div>

                  <span className={s.date}>{formatPostDate(post.createdAt)}</span>
                  <p className={s.description}>{post.description ?? '—'}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <div aria-hidden={!isFetchingMore} className={s.sentinel} ref={sentinelRef}>
        {isFetchingMore ? 'Loading more...' : ''}
      </div>

      <BanUserModal
        isLoading={banningUser}
        onCloseAction={closeBanModal}
        onConfirmAction={() => void handleBanUser()}
        onReasonChangeAction={setBanReason}
        open={Boolean(userToBan)}
        reason={banReason}
        username={userToBan?.username ?? undefined}
      />

      <UnBanUserModal
        isLoading={unbanningUser}
        onCloseAction={closeUnbanModal}
        onConfirmAction={() => void handleUnbanUser()}
        open={Boolean(userToUnban)}
        username={userToUnban?.username ?? undefined}
      />
    </section>
  );
};
