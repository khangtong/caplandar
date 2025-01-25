import { changePassword } from '@/app/lib/actions';
import { useActionState, useState } from 'react';

export default function Password({ active }: { active: string }) {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, action, isPending] = useActionState(changePassword, undefined);

  return (
    <form
      action={action}
      id="password"
      className={`${
        active === 'password' ? '' : 'hidden'
      } max-h- py-6 px-16 ml-64`}
      style={{ maxHeight: 'calc(100vh - 151.2px)' }}
    >
      <section className="mb-5">
        <label
          htmlFor="current-password"
          className="capitalize font-medium text-base"
        >
          current password
        </label>
        <input
          type="password"
          name="password"
          id="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 min-w-100"
          required
        />
        <div className="text-sm text-gray-400 font-light">
          This is your current password.
        </div>
      </section>
      {state?.errors?.currentPassword && (
        <div className="text-left text-xs text-red-500 relative -top-2">
          {state.errors.currentPassword}
        </div>
      )}
      <section className="mb-5">
        <label
          htmlFor="new-password"
          className="capitalize font-medium text-base"
        >
          new password
        </label>
        <input
          type="password"
          name="newPassword"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 min-w-100"
          required
        />
        <div className="text-sm text-gray-400 font-light">
          This will be your new password.
        </div>
      </section>
      {state?.errors?.newPassword && (
        <div className="text-left text-xs text-red-500 relative -top-2">
          {state.errors.newPassword}
        </div>
      )}
      <section className="mb-5">
        <label
          htmlFor="confirm-password"
          className="capitalize font-medium text-base"
        >
          confirm password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 w-full duration-200 bg-neutral-100 min-w-100"
          required
        />
        <div className="text-sm text-gray-400 font-light">
          Confirm the new password.
        </div>
      </section>
      {state?.errors?.confirmPassword && (
        <div className="text-left text-xs text-red-500 relative -top-2">
          {state.errors.confirmPassword}
        </div>
      )}
      <button
        disabled={isPending}
        type="submit"
        className="rounded-lg py-2 px-3 font-bold capitalize border-none text-neutral-100 bg-neutral-800 duration-200"
      >
        Change password
      </button>
    </form>
  );
}
