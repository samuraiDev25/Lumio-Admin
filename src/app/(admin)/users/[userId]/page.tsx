import { UserInformation } from '@/copmonents/users';

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserInformationPage({ params }: PageProps) {
  const { userId } = await params;
  const parsedUserId = Number(userId);

  if (!Number.isFinite(parsedUserId)) {
    return <section>Invalid user id.</section>;
  }

  return <UserInformation userId={parsedUserId} />;
}
