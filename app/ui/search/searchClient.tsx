'use client';

import { use, useActionState } from 'react';
import { searchSchedules } from '@/app/lib/actions';
import CategorySelectionBox from '../categorySelectionBox';
import convertStringToObjectArray from '@/app/lib/convertStringToObjectArray';
import { Category } from '@/app/lib/definitions';

export default function SearchClient({
  categories,
}: {
  categories: Promise<Category[]>;
}) {
  const [state, action, isPending] = useActionState(searchSchedules, undefined);
  const categoryData = use(categories);

  return (
    <div id="main">
      <form action={action} className="relative mt-6 px-9">
        <div className="flex items-center mt-3">
          <label htmlFor="title-input">
            <i className="fa-regular fa-text w-4 mr-3"></i>
          </label>
          <input
            type="text"
            id="title-input"
            name="title"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100"
            placeholder="Enter schedule title"
          />
        </div>
        {state?.errors?.title && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.title}
          </span>
        )}
        <div className="flex items-center mt-3">
          <label htmlFor="year-input">
            <i className="fa-regular fa-calendar w-4 mr-3"></i>
          </label>
          <input
            type="number"
            id="year-input"
            name="year"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100"
            placeholder="YYYY"
            min="1900"
            max="2099"
          />
          <input
            type="number"
            id="month-input"
            name="month"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 ml-3"
            placeholder="MM"
            min="1"
            max="12"
          />
          <input
            type="number"
            id="date-input"
            name="date"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 ml-3"
            placeholder="DD"
            min="1"
            max="31"
          />
        </div>
        {(state?.errors?.year ||
          state?.errors?.month ||
          state?.errors?.date) && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.year || state.errors.month || state.errors.date}
          </span>
        )}
        <div className="flex items-center mt-3">
          <label htmlFor="location-input">
            <i className="fa-regular fa-location-dot w-4 mr-3"></i>
          </label>
          <input
            type="text"
            id="location-input"
            name="location"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100"
            placeholder="Enter schedule location"
          />
        </div>
        {state?.errors?.location && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.location}
          </span>
        )}
        <div className="flex items-center mt-3">
          <label htmlFor="">
            <i className="fa-regular fa-icons w-4 mr-3 mb-3"></i>
          </label>
          <CategorySelectionBox categories={categoryData} />
        </div>
        {state?.errors?.category && (
          <span className="text-left text-xs text-red-500 relative -top-2">
            {state.errors.category}
          </span>
        )}
        <button
          disabled={isPending}
          className="absolute right-9 -bottom-8 rounded-lg p-2 font-bold capitalize border-none text-neutral-100 bg-brand duration-200"
          type="submit"
        >
          Search
        </button>
        <button
          disabled={isPending}
          className="absolute right-30 -bottom-8 rounded-lg p-2 font-bold capitalize border-none text-neutral-100 bg-neutral-800 duration-200"
          type="reset"
        >
          Reset
        </button>
      </form>
      <div className="flex flex-wrap gap-6 mt-13 py-6 px-9 border-t-2 border-hair-line">
        <span className="search-results__amount">
          Results ({state?.data?.length || 0}):
        </span>
        {state?.data?.length &&
          state.data.map((schedule: any) => (
            <div
              className="rounded-lg flex flex-col text-sm justify-between cursor-pointer bg-white border-4 overflow-hidden"
              key={schedule.id}
              style={{ borderColor: schedule.category.color }}
            >
              <div className="relative py-2 pr-2 pl-4.5 border-b-2 border-hair-line flex flex-col justify-center">
                <span
                  className="absolute top-1/2 left-2 h-3/5 w-1 -translate-y-1/2 rounded"
                  style={{ backgroundColor: schedule.category.color }}
                ></span>
                <span className="block font-medium text-base text-nowrap overflow-hidden text-ellipsis">
                  {schedule.title}
                </span>
                <span className="block text-sm text-gray-500">
                  {schedule.timeFrom} - {schedule.timeTo}
                </span>
              </div>
              {(schedule.location ||
                schedule.noti ||
                (schedule.guests && schedule.guests.length > 0)) && (
                <div className="text-xs p-2 flex-1 flex flex-col">
                  {schedule.location && (
                    <span className="mb-0.5">
                      <i className="fa-regular fa-location-dot w-3.25 text-gray-500 mr-px ml-px"></i>
                      {schedule.location}
                    </span>
                  )}
                  {schedule.noti && (
                    <span className="mb-1">
                      <i className="fa-regular fa-bell text-gray-500 mr-1"></i>
                      {new Date(schedule.noti).toLocaleString()}
                    </span>
                  )}
                  {schedule.guests !== '[]' && (
                    <div className="flex max-w-64 text-wrap">
                      <i className="fa-regular fa-user text-gray-500 mr-1"></i>
                      {convertStringToObjectArray(schedule.guests)?.reduce(
                        (acc: any, val, i, arr) => {
                          return (
                            acc +
                            val?.email +
                            (i === arr.length - 1 ? '' : ', ')
                          );
                        },
                        ''
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
