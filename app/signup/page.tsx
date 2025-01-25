import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function Signup() {
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
          href="/login"
        >
          Already have account
        </Link>
        <form action="" id="sign-up" className="py-32 px-16 text-center">
          <h2 className="text-3xl font-bold mb-7">
            Welcome to
            <span className="text-brand ml-2">Caplandar</span>
          </h2>
          <input
            type="email"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full duration-200"
            id="email"
            placeholder="Email"
            required
          />
          <input
            type="text"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full duration-200"
            id="username"
            placeholder="Username"
            required
          />
          <input
            type="password"
            className="py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full duration-200"
            id="password"
            placeholder="Password"
            required
          />
          <label htmlFor="avatar" className="form-label mt-3">
            Choose your avatar (optional)
          </label>
          <input
            type="file"
            className="bg-white py-1.5 px-3 rounded-lg outline-none border border-neutral-200 focus:border-brand focus:shadow-5 mb-3 w-full duration-200"
            id="avatar"
          />
          <button
            type="submit"
            className="rounded-lg p-2 font-bold capitalize w-full border-none text-gray-100 bg-neutral-900 duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
      <div className="h-full flex-1 flex flex-col items-center justify-center p-16 bg-neutral-800">
        <h1 className="text-3xl font-bold text-gray-100 uppercase text-center">
          don't keep
          <span className="text-brand mx-2">everything</span>
          in your
          <span className="text-brand ml-2">brain</span>!
        </h1>
        <Image
          src="/signup/beam-young-man-struggling-with-time-management.png"
          width={400}
          height={500}
          alt="Hero image"
          className="hero-img"
        />
      </div>
    </main>
  );
}
