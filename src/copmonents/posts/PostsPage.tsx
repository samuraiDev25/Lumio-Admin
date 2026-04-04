'use client';

import { NetworkStatus } from '@apollo/client';
import { useApolloClient, useQuery, useSubscription } from '@apollo/client/react';
import { Search, TextField } from '@jstrommash/ui-kit-lumio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_POSTS, POST_CREATED_SUBSCRIPTION } from '@/queries/posts';

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
type PostUser = { id?: string | number | null; username?: string | null };

type PostItem = {
  id: string | number;
  description?: string | null;
  createdAt: string;
  userId?: string | number | null;
  files?: PostFile[] | null;
  user?: PostUser | null;
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
  id: string | number;
  description?: string | null;
  createdAt: string;
  files?: { id?: string; url?: string | null }[] | null;
  user?: PostUser | null;
};

type PostCreatedSubscriptionData = {
  postCreated: PostCreatedPayload;
};

export const PostsPage = () => {
  const client = useApolloClient();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 500);

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

      const { pageSize, search, sortBy } = variablesRef.current;
      const term = search?.trim().toLowerCase() ?? '';
      if (term && !created.user?.username?.toLowerCase().includes(term)) {
        return;
      }

      const item: PostItem = {
        id: created.id,
        description: created.description,
        createdAt: created.createdAt,
        userId: created.user?.id,
        files: (created.files ?? []).map(f => ({ url: f.url })),
        user: created.user,
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
    },
  });

  const posts = data?.getPosts.items ?? [];
  const pageInfo = data?.getPosts;

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
      <h1>Posts</h1>
      <p>Review content, moderate publications, and control the visibility of posts.</p>

      <div className={s.toolbar}>
        <TextField
          className={s.search}
          iconStart={<Search />}
          onChange={event => setSearchInput(event.currentTarget.value)}
          placeholder="Search by username"
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
                  <div className={s.meta}>
                    <span className={s.username}>{post.user?.username ?? '—'}</span>
                    <span className={s.date}>{formatPostDate(post.createdAt)}</span>
                  </div>
                  <p className={s.description}>{post.description ?? '—'}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <div aria-hidden={!isFetchingMore} className={s.sentinel} ref={sentinelRef}>
        {isFetchingMore ? 'Loading more…' : ''}
      </div>
    </section>
  );
};
