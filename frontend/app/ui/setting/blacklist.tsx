import Link from 'next/link';
import Search from '../search';
import axios from 'axios';
import { useEffect, useState } from 'react';
import BlacklistTable from './blacklistTable';

interface BlacklistProps {
  active: string;
  token: string | undefined;
  query: string;
}

export default function Blacklist({ active, token, query }: BlacklistProps) {
  const [users, setUsers] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    async function fetchUsersAndBlockedUsers() {
      if (query !== '') {
        await axios
          .get(
            `http://localhost:8080/api/users/search?usernameOrEmail=${query}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setUsers(res.data.data);
          })
          .catch((err) => {
            console.log(err.response.data.message);
          });
      }

      await axios
        .get(`http://localhost:8080/api/blacklists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBlacklist(res.data.data);
          setBlockedUsers(res.data.data.map((val: any) => val.blacklist));
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    }

    fetchUsersAndBlockedUsers();
  }, [query]);

  return (
    <main
      className={`${
        active === 'blacklist' ? '' : 'hidden'
      } w-3/5 py-6 px-16 ml-64`}
      style={{ maxHeight: 'calc(100vh - 151.2px)' }}
    >
      <span className="text-2xl font-medium">Blacklist</span>
      <span className="block text-sm text-gray-500">
        Blocked users can not search and invite you to their schedules.
      </span>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Search placeholder="Search users..." />
      </div>
      <BlacklistTable
        users={users}
        blacklist={blacklist}
        blockedUsers={blockedUsers}
        query={query}
      />
    </main>
  );
}
