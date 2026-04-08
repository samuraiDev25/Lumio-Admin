'use client';

import {NetworkStatus} from '@apollo/client';
import {useQuery} from '@apollo/client/react';
import {UIEvent, useCallback} from 'react';
import {GET_POSTS} from '@/queries/posts';
import s from './UserPostsGrid.module.scss';

type UserPostsGridProps = {
  username: string;
};

const PAGE_SIZE = 8;

type PostFile = {
  url?: string | null;
};

type PostItem = {
  id: string | number;
  files?: PostFile[] | null;
  user?: {
    id?: string | number | null;
    username?: string | null;
  } | null;
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
  sortBy: 'DATE_DESC';
};

export function UserPostsGrid({username}: UserPostsGridProps) {
  const {data, fetchMore, loading, networkStatus} = useQuery<GetPostsData, GetPostsVariables>(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      pageNumber: 1,
      pageSize: PAGE_SIZE,
      search: username,
      sortBy: 'DATE_DESC',
    },
  });

  const posts = data?.getPosts.items ?? [];
  const filteredPosts = posts.filter(post => post.user?.username === username);
  const pageInfo = data?.getPosts;
  const hasMore = pageInfo ? pageInfo.page < pageInfo.pagesCount : false;
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      if (!pageInfo || isFetchingMore || !hasMore) {
        return;
      }

      const {clientHeight, scrollHeight, scrollTop} = event.currentTarget;
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceToBottom > 120) {
        return;
      }

      void fetchMore({
        variables: {
          pageNumber: pageInfo.page + 1,
          pageSize: PAGE_SIZE,
          search: username,
          sortBy: 'DATE_DESC',
        },
        updateQuery: (prev, {fetchMoreResult}) => {
          if (!fetchMoreResult?.getPosts) {
            return prev;
          }

          return {
            getPosts: {
              ...fetchMoreResult.getPosts,
              items: [...prev.getPosts.items, ...fetchMoreResult.getPosts.items],
            },
          };
        },
      });
    },
    [fetchMore, hasMore, isFetchingMore, pageInfo, username],
  );

  if (loading && !data) {
    return <div className={s.emptyState}>Loading uploaded posts...</div>;
  }

  if (filteredPosts.length === 0) {
    return <div className={s.emptyState}>No uploaded posts.</div>;
  }

  return (
    <div className={s.scrollViewport} onScroll={handleScroll}>
      <div className={s.postGrid}>
        {filteredPosts.map(post => {
          const imageUrl = post.files?.[0]?.url;

          if (!imageUrl) {
            return null;
          }

          return (
            <div key={String(post.id)} className={s.postItem}>
              <div className={s.postImageContainer}>
                {/* Post media URLs come from the API; domains are not fixed at build time. */}
                {/* eslint-disable-next-line @next/next/no-img-element -- remote post URLs from GraphQL */}
                <img alt={`${username} post`} className={s.postImage} loading="lazy" src={imageUrl} />
              </div>
            </div>
          );
        })}
      </div>
      {isFetchingMore ? <div className={s.loader}>Loading more...</div> : null}
    </div>
  );
}
