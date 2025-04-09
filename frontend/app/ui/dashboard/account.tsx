import Link from 'next/link';
import Image from 'next/image';

export default function Account({ userData }: { userData: any }) {
  if (!userData) {
    return <div>You are not logged in</div>;
  }

  return (
    <Link
      className="flex items-center gap-3 text-neutral-50 border-2 border-transparent duration-200 rounded-lg bg-neutral-800 mb-2 py-2 px-3 hover:border-brand-0.4 hover:shadow-3"
      href="/settings"
    >
      <Image
        src={userData.avatar || '/img/default.jpg'}
        width={32}
        height={32}
        alt="Avatar"
        className="rounded-full"
      />
      <span className="name">{userData.username}</span>
    </Link>
  );
}
