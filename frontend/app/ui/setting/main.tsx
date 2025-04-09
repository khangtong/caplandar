'use client';

import { use, useState } from 'react';

import Profile from './profile';
import Password from './password';
import Display from './display';
import Notification from './notification';
import { User } from '@/app/lib/definitions';
import { logout } from '@/app/lib/actions';
import Blacklist from './blacklist';

interface MainSettingProps {
  token: string | undefined;
  user: Promise<User>;
  query: string;
}

export default function Main({ token, user, query }: MainSettingProps) {
  const userData = use(user);
  const [active, setActive] = useState('profile');

  function handleNavigation(e: any) {
    setActive(e.target.innerText.toLowerCase());
  }

  return (
    <div className="flex">
      <div
        className="fixed flex flex-col justify-between w-64 p-6 border-r-2 border-hair-line"
        style={{ height: '-webkit-fill-available' }}
      >
        <div>
          <div
            onClick={(e) => handleNavigation(e)}
            className={`py-1 px-3 rounded duration-200 cursor-pointer text-neutral-900 hover:bg-neutral-100/50 ${
              active === 'profile' && 'bg-neutral-100 font-bold'
            }`}
          >
            <i
              className={`fa-${
                active === 'profile' ? 'solid' : 'regular'
              } fa-user mr-2`}
            ></i>
            Profile
          </div>
          <div
            onClick={(e) => handleNavigation(e)}
            className={`py-1 px-3 rounded duration-200 cursor-pointer text-neutral-900 hover:bg-neutral-100/50 ${
              active === 'password' && 'bg-neutral-100 font-bold'
            }`}
          >
            <i
              className={`fa-${
                active === 'password' ? 'solid' : 'regular'
              } fa-lock mr-2`}
            ></i>
            Password
          </div>
          <div
            onClick={(e) => handleNavigation(e)}
            className={`py-1 pl-2.5 pr-3 rounded duration-200 cursor-pointer text-neutral-900 hover:bg-neutral-100/50 ${
              active === 'display' && 'bg-neutral-100 font-bold'
            }`}
          >
            <i
              className={`fa-${
                active === 'display' ? 'solid' : 'regular'
              } fa-display mr-2`}
            ></i>
            Display
          </div>
          <div
            onClick={(e) => handleNavigation(e)}
            className={`py-1 px-3 rounded duration-200 cursor-pointer text-neutral-900 hover:bg-neutral-100/50 ${
              active === 'notification' && 'bg-neutral-100 font-bold'
            }`}
          >
            <i
              className={`fa-${
                active === 'notification' ? 'solid' : 'regular'
              } fa-bell mr-2`}
            ></i>
            Notification
          </div>
          <div
            onClick={(e) => handleNavigation(e)}
            className={`py-1 pl-2.5 pr-3 rounded duration-200 cursor-pointer text-neutral-900 hover:bg-neutral-100/50 ${
              active === 'blacklist' && 'bg-neutral-100 font-bold'
            }`}
          >
            <i
              className={`fa-${
                active === 'blacklist' ? 'solid' : 'regular'
              } fa-ban mr-2`}
            ></i>
            Blacklist
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="rounded-lg py-2 px-3 font-bold capitalize border-none text-neutral-100 bg-neutral-800 duration-200"
        >
          Log out
        </button>
      </div>
      <Profile active={active} user={userData} />
      <Password active={active} />
      <Display active={active} />
      <Notification active={active} />
      <Blacklist active={active} token={token} query={query} />
    </div>
  );
}
