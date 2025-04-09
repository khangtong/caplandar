'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import axios from 'axios';

import { generateCalendar } from '@/app/lib/generateCalendar';
import { convertSolar2Lunar } from '@/app/lib/convertToLunar';
import Schedule from './schedule';
import { Category } from '@/app/lib/definitions';

interface CalendarProps {
  month: number;
  year: number;
  token: string | undefined;
  schedules: any[];
  setSchedules: (schedules: any) => void;
  categories: Category[];
}

export default function Calendar({
  month,
  year,
  token,
  schedules,
  setSchedules,
  categories,
}: CalendarProps) {
  const [calendarEl, setCalendarEl] = useState<any[]>([]);
  const [lunar, setLunar] = useState(true);
  let weekdaysInWord = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  useEffect(() => {
    setLunar(localStorage.getItem('lunar') === 'true' ? true : false);

    async function fetchSchedules() {
      const res = await axios.get(
        `http://localhost:8080/api/search?year=${year}&month=${
          month > 9 ? month : `0${month}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCalendarEl(generateCalendar(month, year));
      setSchedules(res.data.data);
    }

    fetchSchedules();
  }, [month, year]);

  return (
    <div className="calendar flex-auto m-0 grid grid-rows-calendar grid-cols-calendar text-center">
      {calendarEl.map((days, index) => (
        <div
          key={index}
          className={`calendar-item ${
            days.inMonth || 'text-gray-250 pointer-events-none'
          } relative text-center border-b-0.16 border-b-hair-line border-r-0.16 border-r-hair-line text-xs font-semibold py-1 px-1.5`}
        >
          {days.firstLine ? weekdaysInWord[index] : ''}
          {days.current ? (
            <span
              className="absolute left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-brand -z-10"
              style={{ top: days.firstLine ? '18px' : '1.8px' }}
            ></span>
          ) : (
            ''
          )}
          <div className={`${days.current && 'text-white'}`}>{days.date}</div>
          {schedules.map((schedule: any) => {
            if (
              days.inMonth &&
              +schedule.date.split('-')[1] == month &&
              +schedule.date.split('-')[0] == year &&
              +schedule.date.split('-')[2] == days.date
            )
              return (
                <Schedule
                  key={schedule.id}
                  schedule={schedule}
                  categories={categories}
                />
              );
          })}
          {lunar ? (
            <p className="lunar-day absolute bottom-0 left-1/2 -translate-x-1/2 text-gray-250 text-xs mb-0.5">
              {days.inMonth
                ? convertSolar2Lunar(days.date, month, year, 7).day
                : days.prevMonth
                ? convertSolar2Lunar(
                    days.date,
                    month - 1 < 1 ? 12 : month - 1,
                    month - 1 < 1 ? year - 1 : year,
                    7
                  ).day
                : convertSolar2Lunar(
                    days.date,
                    month + 1 > 12 ? 1 : month + 1,
                    month + 1 > 12 ? year + 1 : year,
                    7
                  ).day}
            </p>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
}
