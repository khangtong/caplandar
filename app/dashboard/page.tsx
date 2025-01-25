'use client';

import { use, useState } from 'react';

import Sidebar from '../ui/dashboard/sidebar';
import SwitchView from '../ui/dashboard/switch-view';
import Calendar from '../ui/dashboard/calendar';
import Heading from '../ui/dashboard/heading';
import { Category, monthsInWord, User } from '../lib/definitions';

interface DashboardProps {
  user: Promise<User>;
  categories: Promise<Category[]>;
  todayList: Promise<any[]>;
  token: string | undefined;
}

export default function Dashboard({
  user,
  categories,
  todayList,
  token,
}: DashboardProps) {
  const userData = use(user);
  const categoryData = use(categories);
  const todayListData = use(todayList);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [schedules, setSchedules] = useState([]);

  function prevMonth() {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth <= 0) {
      newMonth = 12;
      newYear--;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  function today() {
    let newMonth = new Date().getMonth() + 1;
    let newYear = new Date().getFullYear();
    setMonth(newMonth);
    setYear(newYear);
  }

  function nextMonth() {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  function changeMonth(month: number, year: number) {
    setMonth(month);
    setYear(year);
  }

  return (
    <main className="flex">
      <Sidebar
        userData={userData}
        categories={categoryData}
        changeMonth={changeMonth}
        schedules={schedules}
        todayList={todayListData}
      />
      <div className="ml-64 flex-1">
        <header className="w-full">
          <nav className="flex items-center py-1.5 px-6 text-1.5xl border-b-0.16 border-hair-line justify-between">
            <Heading
              currentMonth={monthsInWord[month - 1]}
              currentYear={year}
            />
            <SwitchView />
            <div className="flex items-center">
              <div
                onClick={prevMonth}
                className="prev-month text-base h-9 w-9 rounded-lg p-4 flex items-center justify-center cursor-pointer bg-gray-100"
              >
                <i className="fa-solid fa-angle-left"></i>
              </div>
              <div
                onClick={today}
                className="today text-base h-9 w-fit rounded-lg p-4 mx-2 flex items-center justify-center cursor-pointer bg-gray-100"
              >
                Today
              </div>
              <div
                onClick={nextMonth}
                className="next-month text-base h-9 w-9 rounded-lg p-4 flex items-center justify-center cursor-pointer bg-gray-100"
              >
                <i className="fa-solid fa-angle-right"></i>
              </div>
            </div>
          </nav>
        </header>
        <Calendar
          month={month}
          year={year}
          token={token}
          schedules={schedules}
          setSchedules={setSchedules}
          categories={categoryData}
        />
      </div>
    </main>
  );
}
