import Link from 'next/link';
import { cookies } from 'next/headers';

import Main from '../ui/setting/main';
import { fetchUser } from '../lib/data';

export default async function Settings(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const token = (await cookies()).get('session')?.value;
  const user = fetchUser(token);

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  return (
    <main>
      <Link href="/">
        <i className="fa-solid fa-calendar-lines-pen absolute top-8 left-1/2 -translate-x-1/2 text-2xl text-brand cursor-pointer">
          <span className="ml-1 font-lexend">Caplandar</span>
        </i>
      </Link>
      <header className="mt-8 pt-6 pb-4 pl-9 border-b-2 border-hair-line">
        <h1 className="text-3xl font-bold capitalize">settings</h1>
        <span className="text-base text-gray-500">
          Manage your profile, password and more.
        </span>
      </header>
      <Main token={token} user={user} query={query} />
    </main>
  );
}
