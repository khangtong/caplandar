import Link from 'next/link';
import { useEffect, useState } from 'react';

import DatePicker from '../datepicker';
import TodayList from './today-list';
import CategorySection from './category-section';
import AddScheduleForm from './add-schedule-form';
import Account from './account';
import CategoryForm from './category-form';
import { Category, User } from '@/app/lib/definitions';

interface SidebarProps {
  userData: User;
  categories: Category[];
  todayList: any[];
  changeMonth: (month: number, year: number) => void;
  schedules: any[];
}

export default function Sidebar({
  userData,
  categories,
  todayList,
  changeMonth,
  schedules,
}: SidebarProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [category, setCategory] = useState<Category>(undefined);
  const [openAddScheduleForm, setOpenAddScheduleForm] = useState(false);

  return (
    <div>
      <CategoryForm
        openCategory={openCategory}
        editCategory={editCategory}
        category={category}
      />
      <AddScheduleForm
        openAddScheduleForm={openAddScheduleForm}
        categories={categories}
      />
      <div className="sidebar fixed h-screen w-64 border-r-0.16 border-solid border-hair-line bg-neutral-900 transition-all duration-500 text-white px-2 pt-2 overflow-y-auto">
        <Account userData={userData} />
        <button
          className="add-schedule-open-btn w-full py-2 border-none rounded-lg font-bold tracking-widest bg-brand/40 uppercase text-brand transition-all duration-250 text-sm relative outline-2 outline outline-brand mb-2 hover:text-neutral-800 hover:bg-brand hover:outline-none"
          onClick={() => setOpenAddScheduleForm(!openAddScheduleForm)}
        >
          add schedule
        </button>
        <Link
          href="/search"
          className="flex items-center bg-gray-100 border-none rounded-lg px-4 py-2 mb-2 no-underline text-neutral-800 duration-300 hover:bg-gray-200 hover:shadow-1"
        >
          <svg
            className="w-5 h-5 mr-2 fill-neutral-800"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <span className="text-sm font-medium">Search</span>
        </Link>
        <DatePicker
          id="date-picker"
          textColor="gray-100"
          backgroundColor="neutral-800"
          borderColor="transparent"
          marginBottom="2"
          changeMonth={changeMonth}
          name="date"
        />
        <div className="rounded-lg bg-neutral-800 mb-2 py-2 px-3">
          <span className="text-sm font-light text-hair-line">Today</span>
          <TodayList todayList={todayList} />
        </div>
        <CategorySection
          categories={categories}
          schedules={schedules}
          openCategory={openCategory}
          editCategory={editCategory}
          setOpenCategory={setOpenCategory}
          setEditCategory={setEditCategory}
          setCategory={setCategory}
        />
      </div>
    </div>
  );
}
