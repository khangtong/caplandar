import { useEffect, useState } from 'react';

export default function Notification({ active }: { active: string }) {
  return (
    <form
      action=""
      id="notification"
      className={`${
        active === 'notification' ? '' : 'hidden'
      } max-h- py-6 px-16 ml-64`}
      style={{ maxHeight: 'calc(100vh - 151.2px)' }}
    >
      <div className="form-check form-switch mb-6">
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer mr-2">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={true}
            />
            <div className="group peer bg-white rounded-full duration-300 w-8 h-4 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-2 after:w-2 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
          </label>
          <label className="form-check-label" htmlFor="noti-email">
            Notify schedules by sending email
          </label>
        </div>
        <div className="text-sm text-gray-400 font-light">
          Turn on to receive schedule notifications. We will send an email to
          your email address when the schedule comes.
        </div>
      </div>
      <div className="form-check form-switch">
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer mr-2">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={false}
            />
            <div className="group peer bg-white rounded-full duration-300 w-8 h-4 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-2 after:w-2 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
          </label>
          <label className="form-check-label" htmlFor="noti-email">
            Notify schedules by browser notification
          </label>
        </div>
        <div className="text-sm text-gray-400 font-light">
          Turn on to receive schedule notifications. We will send a notification
          to your browser when the schedule comes.
        </div>
      </div>
    </form>
  );
}
