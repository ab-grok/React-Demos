"use client";
import { EventHandler, FormEvent, useRef, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const counterRef = useRef<NodeJS.Timeout | null>(null);

  function startCount() {
    counterRef.current = setInterval(() => setCounter((p) => p + 1), 1000);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.error("sth working");
    if (!counterRef.current) {
      setCounter(0);
      setError("");
      startCount();
    }

    try {
      const data = await fetch("/api/logLimit");
      const { success, reset } = await data?.json();
      // console.log("after await data: ", success, reset);

      if (!success) {
        const secs = Math.floor((reset - Date.now()) / 1000);
        setError("Too many attempts. Try again in " + secs + "s");
        clearInterval(counterRef.current!);
        counterRef.current = null;
      }
    } catch (e) {
      clearInterval(counterRef.current!);
      counterRef.current = null;
      setCounter(0);
    }
  }

  return (
    <main className="relative mx-auto my-auto grid h-auto space-y-2">
      <div className="relative left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border-6 border-red-900 bg-red-500 text-2xl font-semibold text-white">
        {counter}
      </div>
      <form
        onSubmit={onSubmit}
        className="flex min-h-20 w-120 flex-col justify-center rounded-xl border-t-2 border-white/10 bg-gray-900 p-4 shadow-white/10"
      >
        <section className="border-background mt-10 flex h-auto w-auto flex-col items-center justify-center space-y-2 rounded-lg border-2 bg-white/10 p-4">
          <div className="flex h-30 w-full flex-col border-b-3 border-white/20 p-2">
            <p className="font-semibold text-white"> Username</p>
            <input
              type="text"
              placeholder="username"
              className="h-1/2 w-full rounded-2xl bg-white px-2 font-semibold shadow-sm shadow-black"
            />
          </div>
          <div className="flex h-30 w-full flex-col p-2">
            <p className="font-semibold text-white"> Password</p>
            <input
              type="password"
              placeholder="Password"
              className="h-1/2 w-full rounded-2xl bg-white px-2 font-semibold shadow-sm shadow-black"
            />
          </div>
        </section>
        <section className="flex h-auto w-auto items-center justify-center p-4">
          <button className="h-10 w-1/3 rounded-lg bg-linear-to-b from-green-700 to-green-800 font-black shadow-sm transition-all duration-100 hover:from-green-400 hover:to-green-500 active:translate-y-0.5">
            Sign in
          </button>
        </section>
        {error && (
          <section className="flex h-auto w-auto items-center justify-center p-4 font-semibold text-wrap text-red-600">
            <p> {error}</p>
          </section>
        )}
      </form>
    </main>
  );
}
