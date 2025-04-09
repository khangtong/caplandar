import { cookies } from 'next/headers';
import Dashboard from './dashboard/page';
import { fetchCategory, fetchTodayList, fetchUser } from './lib/data';

export default async function Home() {
  const token = (await cookies()).get('session')?.value;
  const user = fetchUser(token);
  const categories = fetchCategory(token);
  const todayList = fetchTodayList(token);

  return (
    <Dashboard
      user={user}
      categories={categories}
      todayList={todayList}
      token={token}
    />
  );
}
