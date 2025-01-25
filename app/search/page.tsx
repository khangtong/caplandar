import Link from 'next/link';
import { cookies } from 'next/headers';
import SearchClient from '../ui/search/searchClient';
import { fetchCategory } from '../lib/data';

export default async function Search() {
  const token = (await cookies()).get('session')?.value;
  const categories = fetchCategory(token);

  return (
    <main>
      <Link href="/">
        <i className="fa-solid fa-calendar-lines-pen absolute top-8 left-1/2 -translate-x-1/2 text-2xl text-brand cursor-pointer">
          <span className="ml-1 font-lexend">Caplandar</span>
        </i>
      </Link>
      <header className="mt-8 pt-6 pb-4 pl-9 border-b-2 border-hair-line">
        <h1 className="text-3xl font-bold capitalize">search</h1>
        <span className="text-base text-gray-500">
          Search all your schedules by filters.
        </span>
      </header>
      <SearchClient categories={categories} />
    </main>
  );
}
