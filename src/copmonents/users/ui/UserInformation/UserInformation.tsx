'use client';

import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useQuery} from '@apollo/client/react';
import {ArrowBackOutline, Tab} from '@jstrommash/ui-kit-lumio';
import {GET_USER_BY_ID} from '@/queries/users';
import {clearAccessToken, readAccessToken} from '@/shared/lib/auth';
import {formatDate, formatUserId, GetUserByIdData, GetUserByIdVariables} from '../../model';
import {UserPostsGrid} from './UserPostsGrid/UserPostsGrid';
import s from './UserInformation.module.scss';
import {UserFollowers} from "@/copmonents/users/ui/UserInformation/UserFollowers/UserFollowers";
import {PaymentsPage} from "@/copmonents/payments/PaymentsPage";
import {UserFollowing} from "@/copmonents/users/ui/UserInformation/UserFollowing/UserFollowing";

type Props = {
  userId: number;
};

export function UserInformation({userId}: Props) {
  const router = useRouter();
  const accessToken = readAccessToken();
  const hasAccessToken = Boolean(accessToken);
  const {data, error, loading} = useQuery<GetUserByIdData, GetUserByIdVariables>(GET_USER_BY_ID, {
    skip: !hasAccessToken,
    variables: {id: userId},
  });

  useEffect(() => {
    if (!hasAccessToken) {
      router.replace('/login');
    }
  }, [hasAccessToken, router]);

  useEffect(() => {
    if (error) {
      clearAccessToken();
      router.replace('/login');
    }
  }, [error, router]);

  if (!hasAccessToken) {
    return null;
  }

  if (loading) {
    return <section className={s.state}>Loading user information...</section>;
  }

  const user = data?.user;

  if (!user) {
    return <section className={s.state}>User not found.</section>;
  }

  const profile = user.profile;
  const avatarLabel = user.username.slice(0, 2).toUpperCase();
  const tabItems = [
    {
      label: 'Uploaded photos',
      value: 'uploaded-photos',
      children: <UserPostsGrid username={user.username} />,
    },
    {
      label: 'Payments',
      value: 'payments',
      children: <PaymentsPage />,
    },
    {
      label: 'Followers',
      value: 'followers',
      children: <UserFollowers />,
    },
    {
      label: 'Following',
      value: 'following',
      children: <UserFollowing />,
    },
  ];

  return (
    <section className={s.page}>
      <div className={s.breadcrumbs}>
        <Link className={s.backLink} href="/users">
          <ArrowBackOutline /> Back to users list
        </Link>
      </div>

      <div className={s.layout}>
        <aside className={s.heroCard}>
          <div className={s.heroMain}>
            <div className={s.avatarWrap}>
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote avatar URLs come from the API
                <img alt={user.username} className={s.avatar} src={profile.avatarUrl} />
              ) : (
                <div className={s.avatarFallback}>{avatarLabel}</div>
              )}
            </div>

            <div className={s.heroContent}>
              <h1 className={s.title}>{user.username}</h1>
              <p className={s.subtitle}>{user.email}</p>
            </div>
          </div>

          <div className={s.summaryGrid}>
            <article className={s.summaryCard}>
              <span className={s.summaryLabel}>UserID</span>
              <strong className={s.summaryValue}>{formatUserId(user.id)}</strong>
            </article>

            <article className={s.summaryCard}>
              <span className={s.summaryLabel}>Profile Creation Date</span>
              <strong className={s.summaryValue}>{formatDate(user.createdAt)}</strong>
            </article>
          </div>
        </aside>

        <div className={s.contentGrid}>
          <Tab defaultTab="uploaded-photos" items={tabItems} />
        </div>
      </div>
    </section>
  );
}
