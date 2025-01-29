import { useActionState } from 'react';
import Image from 'next/image';

import { addGuest } from '@/app/lib/actions';

interface AddGuestProps {
  openAddGuest: boolean;
  addGuests: (user: any) => void;
  position: { x: number; y: number };
}

export default function AddGuest({
  openAddGuest,
  addGuests,
  position,
}: AddGuestProps) {
  const [state, action, isPending] = useActionState(addGuest, undefined);

  function select(user: any) {
    addGuests(user);
  }

  return (
    <div
      className={`${
        openAddGuest || 'hidden'
      } absolute w-max rounded-lg bg-white p-3 shadow-4 z-50`}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <form action={action} className="flex gap-3">
        <input
          type="text"
          className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full bg-neutral-100 duration-200"
          id="search-users-input"
          placeholder="Enter username or email"
          name="usernameOrEmail"
          required
        />
        <button
          disabled={isPending}
          className="border-none py-2 px-2.5 rounded-lg bg-neutral-800 text-white"
          type="submit"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      <div className="max-h-80 overflow-y-auto flex flex-col">
        {state?.data ? (
          state.data.map((guest: any) => (
            <div
              key={guest.id}
              onClick={() => select(guest)}
              className="flex items-center gap-2 rounded-lg mt-3 p-2 text-sm bg-neutral-100 cursor-pointer duration-200 hover:bg-neutral-200"
            >
              <Image
                src={guest.avatar || '/img/default.jpg'}
                height={24}
                width={24}
                alt="user"
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-bold">{guest.username}</span>
                <span>{guest.email}</span>
              </div>
            </div>
          ))
        ) : state?.message ? (
          <span className="mt-2 font-bold">{state.message}</span>
        ) : (
          <span className="hidden mt-2 font-bold">
            No users were found that match your search
          </span>
        )}
      </div>
    </div>
  );
}
