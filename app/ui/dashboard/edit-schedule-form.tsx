import { useActionState, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

import DatePicker from '../datepicker';
import CategorySelectionBox from '../categorySelectionBox';
import { deleteSchedule, updateSchedule } from '@/app/lib/actions';
import AddGuest from './add-guest';
import convertStringToObjectArray from '@/app/lib/convertStringToObjectArray';
import { Category } from '@/app/lib/definitions';

interface EditScheduleFormProps {
  openEditScheduleForm: boolean;
  schedule: any;
  categories: Category[];
  position: { x: number; y: number };
}

export default function EditScheduleForm({
  openEditScheduleForm,
  schedule,
  categories,
  position,
}: EditScheduleFormProps) {
  const [state, action, isPending] = useActionState(updateSchedule, undefined);
  const [scheduleState, setScheduleState] = useState(schedule);
  const [title, setTitle] = useState(schedule.title);
  const [timeFrom, setTimeFrom] = useState(schedule.timeFrom);
  const [timeTo, setTimeTo] = useState(schedule.timeTo);
  const [location, setLocation] = useState(schedule.location);
  const [noti, setNoti] = useState(parseNotificationTime(schedule));
  const [notiUnit, setNotiUnit] = useState(schedule.notiUnit);
  const [categoryId, setCategoryId] = useState(schedule.category.id);
  const [openAddGuest, setOpen] = useState(false);
  const [guests, setGuests] = useState(
    convertStringToObjectArray(scheduleState.guests) || []
  );

  function parseNotificationTime(schedule: any): number {
    let notiDate = schedule.noti;
    if (typeof schedule.noti === 'string') {
      notiDate = new Date(schedule.noti);
    }
    let scheduleDate = new Date(`${schedule.date}T${schedule.timeFrom}`);
    let notiInMinutes =
      (Date.parse(scheduleDate.toString()) - Date.parse(notiDate)) / 1000 / 60;

    if (notiInMinutes >= 60) {
      notiInMinutes /= 60;
      schedule.notiUnit = 'h';
      if (notiInMinutes >= 24) {
        notiInMinutes /= 24;
        schedule.notiUnit = 'd';
        if (notiInMinutes >= 7) {
          notiInMinutes /= 7;
          schedule.notiUnit = 'w';
        }
      }
    }

    return Math.round(notiInMinutes);
  }

  function addGuests(newGuest: any) {
    if (guests[0]?.id == undefined) {
      setGuests([]);
    }

    setGuests((prevGuests: any) => {
      if (!prevGuests.some((guest: any) => guest.id === newGuest.id)) {
        return [...prevGuests, newGuest];
      }
      return prevGuests;
    });
  }

  function removeGuest(guestId: string) {
    setGuests((prevGuests: any) =>
      prevGuests.filter((guest: any) => guest.id !== guestId)
    );
  }

  return (
    <div>
      <AddGuest
        openAddGuest={openAddGuest}
        addGuests={addGuests}
        position={{
          x: position.x < 0 ? position.x - 316 : position.x + 392,
          y: position.y + 180,
        }}
      />
      <form
        action={action}
        id="edit-schedule-form"
        className={`absolute max-w-409 h-fit p-6 rounded-lg bg-white shadow-4 z-40 ${clsx(
          openEditScheduleForm || 'hidden'
        )}`}
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        <input
          type="text"
          name="id"
          className="hidden"
          defaultValue={schedule.id}
        />
        <input
          type="text"
          className="form-control py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full bg-neutral-100 duration-200"
          id="schedule-title-input--edit"
          placeholder="Enter schedule title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {state?.errors?.title && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.title}
          </span>
        )}
        <div className="flex items-center justify-between mb-3">
          <label className="w-4 mr-3" htmlFor="schedule-date-picker">
            <i className="fa-light fa-calendar"></i>
          </label>
          <DatePicker
            id="schedule-date-picker--edit"
            textColor="neutral-800"
            backgroundColor="neutral-100"
            borderColor="neutral-200"
            marginBottom="0"
            changeMonth={() => null}
            name="date"
            schedule={schedule}
          />
        </div>
        {state?.errors?.date && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.date}
          </span>
        )}
        <div className="flex items-center justify-between mb-3">
          <label className="w-4 mr-3" htmlFor="schedule-time-input">
            <i className="fa-light fa-clock"></i>
          </label>
          <input
            type="time"
            className="form-control w-full py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
            id="schedule-time-input--from--edit"
            name="from"
            value={timeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
            required
          />
          <span className="mx-2">-</span>
          <input
            type="time"
            className="form-control w-full py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
            id="schedule-time-input--to--edit"
            name="to"
            value={timeTo}
            onChange={(e) => setTimeTo(e.target.value)}
            required
          />
        </div>
        {state?.errors?.timeFrom && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.timeFrom}
          </span>
        )}
        {state?.errors?.timeTo && (
          <div>
            <br />
            <span className="text-left text-xs text-red-500 relative -top-2">
              {state.errors.timeTo}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <label className="w-4 mr-3" htmlFor="schedule-location-input">
            <i className="fa-light fa-location-dot"></i>
          </label>
          <input
            type="text"
            className="form-control w-full py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
            id="schedule-location-input--edit"
            placeholder="Enter schedule location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {state?.errors?.location && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.location}
          </span>
        )}
        <div className="flex items-center justify-between mb-3">
          <label className="w-4 mr-3" htmlFor="schedule-noti-input">
            <i className="fa-light fa-bell"></i>
          </label>
          <div className="flex w-full">
            <input
              type="number"
              min="0"
              className="form-control py-1.5 px-3 rounded-l-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
              id="schedule-noti-input--edit"
              name="noti"
              value={noti}
              onChange={(e) => setNoti(+e.target.value)}
            />
            <select
              id="schedule-noti-select--edit"
              className="form-select flex-1 py-1.5 px-3 rounded-r-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
              value={notiUnit}
              onChange={(e) => setNotiUnit(e.target.value)}
              name="unit"
            >
              <option value="m">minutes</option>
              <option value="h">hours</option>
              <option value="d">days</option>
              <option value="w">weeks</option>
            </select>
          </div>
        </div>
        {state?.errors?.noti && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.noti}
          </span>
        )}
        <div className="flex items-center justify-between mb-3">
          <label className="w-4 mr-3" htmlFor="schedule-guest-input">
            <i className="fa-light fa-user-plus"></i>
          </label>
          <div className="flex flex-1 flex-wrap gap-1.5 w-max mr-2">
            {guests[0]?.id == undefined ||
              guests.map((guest: any, index: number) => (
                <div
                  key={index}
                  id={guest.email}
                  className="p-2 border-2 border-hair-line rounded-full flex items-center gap-1.5"
                >
                  <Image
                    src={guest.avatar || '/img/default.jpg'}
                    height={20}
                    width={20}
                    alt="guest"
                    className="rounded-full"
                  />
                  <span className="text-xs">
                    {guest.username.startsWith("'")
                      ? guest.username.slice(1, -1)
                      : guest.username}
                  </span>
                  <i
                    className="fa-regular fa-xmark cursor-pointer text-sm"
                    onClick={() => removeGuest(guest.id)}
                  ></i>
                </div>
              ))}
          </div>
          <button
            type="button"
            id="schedule-guest-btn--edit"
            onClick={() => setOpen(!openAddGuest)}
            className="rounded-lg p-2 font-bold border-none text-gray-100 bg-neutral-900 duration-200"
          >
            Add
          </button>
          <input
            type="text"
            id="schedule-guest-input"
            name="guests"
            className="hidden"
            value={guests.map((guest: any) => guest.email).join(', ')}
            readOnly={true}
          />
        </div>
        <CategorySelectionBox categories={categories} categoryId={categoryId} />
        {state?.errors?.category && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.category}
          </span>
        )}
        <div className="flex gap-2">
          <button
            disabled={isPending}
            className="delete-schedule-btn rounded-lg p-2 font-bold capitalize w-full border-none text-gray-100 bg-red-500 duration-200"
            onClick={() => deleteSchedule(schedule.id)}
          >
            delete
          </button>
          <button
            disabled={isPending}
            type="submit"
            className="edit-schedule-btn rounded-lg p-2 font-bold capitalize w-full border-none text-gray-100 bg-neutral-900 duration-200"
          >
            save
          </button>
        </div>
      </form>
    </div>
  );
}
