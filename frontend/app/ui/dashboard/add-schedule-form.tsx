import { useActionState, useState, useEffect } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import DatePicker from '../datepicker';
import CategorySelectionBox from '../categorySelectionBox';
import { addSchedule } from '@/app/lib/actions';
import AddGuest from './add-guest';
import { Category } from '@/app/lib/definitions';

export default function AddScheduleForm({
  openAddScheduleForm,
  categories,
}: {
  openAddScheduleForm: boolean;
  categories: Category[];
}) {
  const [state, action, isPending] = useActionState(addSchedule, undefined);
  const [openAddGuest, setOpen] = useState(false);
  const [guests, setGuests] = useState([]);
  const router = useRouter();

  function addGuests(newGuest: any) {
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

  useEffect(() => {
    if (isPending) {
      const toastId = toast.loading('Loading...');
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 1000);
    } else {
      if (state !== undefined) {
        if (state?.errors) {
          toast.error(state?.message || `Failed to add schedule`);
        } else {
          toast.success(`Schedule has been added!`);
          router.refresh();
        }
      }
    }
  }, [isPending, state]);

  return (
    <div>
      <AddGuest
        openAddGuest={openAddGuest}
        addGuests={addGuests}
        position={{ x: 700, y: 300 }}
      />
      <form
        action={action}
        id="add-schedule-form"
        className={`absolute top-16 left-68 max-w-409 h-fit p-6 rounded-lg bg-white shadow-4 z-40 ${clsx(
          openAddScheduleForm || 'hidden'
        )}`}
      >
        <input
          type="text"
          className="form-control py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full bg-neutral-100 duration-200"
          id="schedule-title-input--add"
          placeholder="Enter schedule title"
          name="title"
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
            id="schedule-date-picker--add"
            textColor="neutral-800"
            backgroundColor="neutral-100"
            borderColor="neutral-200"
            marginBottom="0"
            changeMonth={() => null}
            name="date"
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
            id="schedule-time-input--from--add"
            name="from"
            required
          />
          <span className="mx-2">-</span>
          <input
            type="time"
            className="form-control w-full py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
            id="schedule-time-input--to--add"
            name="to"
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
            id="schedule-location-input--add"
            placeholder="Enter schedule location"
            name="location"
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
          <div className="flex">
            <input
              type="number"
              min="0"
              className="form-control py-1.5 px-3 rounded-l-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
              id="schedule-noti-input--add flex-3 bg-neutral-100"
              name="noti"
              defaultValue={0}
            />
            <select
              id="schedule-noti-select--add"
              className="form-select py-1.5 px-3 rounded-r-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 bg-neutral-100 duration-200"
              defaultValue={'minutes'}
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
          <div className="flex flex-wrap gap-1.5 w-full">
            {guests.map((guest: any) => (
              <div
                key={guest.id}
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
                <span className="text-sm">{guest.username}</span>
                <i
                  className="fa-regular fa-xmark cursor-pointer text-sm"
                  onClick={() => removeGuest(guest.id)}
                ></i>
              </div>
            ))}
          </div>
          <button
            type="button"
            id="schedule-guest-btn--add"
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
        <CategorySelectionBox categories={categories} />
        {state?.errors?.category && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.category}
          </span>
        )}
        <button
          disabled={isPending}
          type="submit"
          className="add-schedule-btn rounded-lg p-2 font-bold capitalize w-full border-none text-gray-100 bg-neutral-900 duration-200"
        >
          add schedule
        </button>
      </form>
    </div>
  );
}
