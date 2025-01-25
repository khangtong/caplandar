import { updateProfile } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
import Image from 'next/image';
import { useActionState, useState } from 'react';

interface ProfileProps {
  active: string;
  user: User;
}

export default function Profile({ active, user }: ProfileProps) {
  const [avatar, setAvatar] = useState(user?.avatar || '/img/default.jpg');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [state, action, isPending] = useActionState(updateProfile, undefined);

  function handleChangeAvatar(e: any) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onloadend = function (event) {
      setAvatar((event?.target?.result || avatar) as string);
    };
  }

  return (
    <form
      action={action}
      id="profile"
      className={`${
        active === 'profile' ? '' : 'hidden'
      } max-h- py-6 px-16 ml-64`}
      style={{ maxHeight: 'calc(100vh - 151.2px)' }}
    >
      <section className="mb-5">
        <label htmlFor="avatar" className="capitalize">
          <Image
            width={50}
            height={50}
            src={avatar}
            alt="Your avatar"
            className="mb-2 rounded-full"
          />
        </label>
        <input
          type="file"
          id="avatar"
          onChange={(e) => handleChangeAvatar(e)}
          className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 min-w-100"
        />
        <input
          type="text"
          name="avatar"
          value={avatar}
          onChange={() => {}}
          className="hidden"
        />
        <div className="text-sm text-gray-400 font-light">
          You can change your avatar here.
        </div>
      </section>
      <section className="mb-5">
        <label htmlFor="username" className="capitalize font-medium text-base">
          username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 min-w-100"
          required
        />
        <div className="text-sm text-gray-400 font-light">
          This is your public display name. It can be your real name or a
          pseudonym.
        </div>
      </section>
      {state?.errors?.username && (
        <span className="text-left text-xs text-red-500 relative -top-2">
          {state.errors.username}
        </span>
      )}
      <section className="mb-5">
        <label htmlFor="email" className="capitalize font-medium text-base">
          email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 min-w-100"
          required
        />
        <div className="text-sm text-gray-400 font-light">
          You can change your email here.
        </div>
      </section>
      {state?.errors?.email && (
        <span className="text-left text-xs text-red-500 relative -top-2">
          {state.errors.email}
        </span>
      )}
      <button
        disabled={isPending}
        type="submit"
        className="block rounded-lg py-2 px-3 font-bold capitalize border-none text-neutral-100 bg-neutral-800 duration-200"
      >
        Save changes
      </button>
    </form>
  );
}
