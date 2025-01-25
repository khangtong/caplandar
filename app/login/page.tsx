"use client";

import Link from "next/link";
import Image from "next/image";
import { login } from "../lib/actions";
import { useActionState } from "react";

export default function Login() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <main id="main" className="h-screen flex">
      <div className="relative flex-1 p-8 bg-neutral-100">
        <Link href="/">
          <i className="fa-solid fa-calendar-lines-pen text-2xl text-brand">
            <span className="font-lexend ml-1">Caplandar</span>
          </i>
        </Link>
        <Link
          className="absolute right-8 top-8 font-medium text-neutral-800 hover:underline"
          href="/signup"
        >
          Create an account
        </Link>
        <form action={action} id="log-in" className="py-32 px-16 text-center">
          <h2 className="text-3xl font-bold mb-7">Welcome back!</h2>
          <input
            type="email"
            name="email"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full duration-200"
            id="email"
            placeholder="Email"
            required
          />
          {state?.errors?.email && (
            <span className="text-left text-xs text-red-500 relative -top-2">
              {state.errors.email}
            </span>
          )}
          <input
            type="password"
            name="password"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full duration-200"
            id="password"
            placeholder="Password"
            required
          />
          {state?.errors?.password && (
            <span className="text-left text-xs text-red-500 relative -top-2">
              {state.errors.password}
            </span>
          )}
          <button
            disabled={isPending}
            type="submit"
            className="rounded-lg p-2 font-bold capitalize w-full border-none text-gray-100 bg-neutral-900 duration-200"
          >
            Log in
          </button>
        </form>
        <Link
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-medium text-neutral-800 hover:underline"
          href="#"
        >
          Forgot password?
        </Link>
      </div>
      <div className="h-full flex-1 flex flex-col items-center justify-center p-16 bg-neutral-800">
        <h1 className="text-3xl font-bold text-gray-100 uppercase text-center mb-4">
          <span className="text-brand mr-2">time</span>
          managed,
          <span className="text-brand mx-2">life</span>enhanced!
        </h1>
        <Image
          src="/login/beam-people-working-in-a-team.png"
          width={500}
          height={500}
          alt="Hero image"
          className="hero-img"
        />
      </div>
    </main>
  );
}
