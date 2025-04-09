import { useState } from 'react';
import EditScheduleForm from './edit-schedule-form';
import { CategoryType } from '@/app/lib/definitions';

export default function Schedule({
  schedule,
  categories,
}: {
  schedule: any;
  categories: CategoryType[];
}) {
  const [openEditScheduleForm, setOpenEditScheduleForm] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleOpenEditScheduleForm(e: any) {
    const clientRect = e.target.getBoundingClientRect();
    const visualViewportHeight = window.visualViewport?.height || 0;
    const visualViewportWidth = window.visualViewport?.width || 0;
    const top = visualViewportHeight - clientRect.top < 415 ? -278 : 0;
    const left = visualViewportWidth - clientRect.right > 360 ? 192 : -356;

    setPosition({ x: left, y: top });

    setOpenEditScheduleForm(!openEditScheduleForm);
  }

  return (
    <div>
      <EditScheduleForm
        openEditScheduleForm={openEditScheduleForm}
        schedule={schedule}
        categories={categories}
        position={position}
      />
      <div
        id={`schedule-${schedule.id}`}
        className={`schedule-el schedule-category-${schedule.category.id} text-left text-neutral-800 mt-1 px-1 rounded border-l-4 shadow-8 font-normal text-nowrap overflow-hidden text-ellipsis cursor-pointer`}
        style={{ borderColor: schedule.category.color }}
        onClick={(e) => handleOpenEditScheduleForm(e)}
      >
        <span className="text-gray-400 font-light">
          {schedule.timeFrom.slice(0, 5)}-{schedule.timeTo.slice(0, 5)}
        </span>{' '}
        | <span className="font-bold">{schedule.title}</span>
      </div>
    </div>
  );
}
