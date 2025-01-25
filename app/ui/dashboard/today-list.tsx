'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import axios from 'axios';
import clsx from 'clsx';

export default function TodayList({ todayList }: { todayList: any[] }) {
  return (
    <div className="mb-1">
      <div className={`${clsx(todayList.length > 0 && 'hidden')}`}>
        <Image
          src="/img/beam-man-taking-a-bath-and-reading.png"
          height={50}
          width={200}
          alt="No schedules today"
        />
        <span className="text-sm">You have no schedules today!</span>
      </div>
      {todayList.map((schedule: any) => (
        <div
          key={schedule.id}
          className={`flex flex-col text-neutral-800 rounded-lg mt-2 py-2 px-3`}
          style={{ backgroundColor: schedule.category.color }}
        >
          <span className="text-sm">
            {schedule.timeFrom.slice(0, 5)} - {schedule.timeTo.slice(0, 5)}
          </span>
          <span className="font-medium">{schedule.title}</span>
        </div>
      ))}
    </div>
  );
}
