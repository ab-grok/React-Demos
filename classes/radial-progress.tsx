"use client";
import { useRef, useState } from "react";

export default function Home() {
  const radial = useRef<SVGCircleElement>(null);
  const progress = useRef<NodeJS.Timeout>(null);
  const timeOut = useRef<NodeJS.Timeout>(null);
  const [progressValue, setProgressValue] = useState(820);

  function startProgress(pause?: boolean) {
    if (timeOut.current) clearInterval(timeOut.current);

    if (progress.current && !pause) {
      clearInterval(progress.current);
      progress.current = null;
      return;
    }

    !pause && setProgressValue(820);

    progress.current = setInterval(() => {
      setProgressValue((value) => {
        if (value < 1 && progress.current) {
          clearInterval(progress.current);
          progress.current = null;
        }
        return value - 1;
      });
    }, 1);
  }

  function pauseProgress() {
    if (progress.current) {
      clearInterval(progress.current);
      progress.current = null;
    }

    if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = null;
    }

    timeOut.current = setTimeout(() => {
      startProgress(true);
    }, 5000);
  }

  return (
    <main className="relative grid mx-auto my-auto space-y-2 h-3/4 ">
      <section className="w-100 items-center justify-center h-100 grid mx-auto my-auto rounded-full bg-neutral-800 box-shadow">
        <svg
          width={300}
          height={300}
          viewBox="0 0 300 300"
          strokeWidth={20}
          stroke="fff"
        >
          <circle
            ref={radial}
            fill="none"
            cy={150}
            cx={150}
            r={130}
            stroke="#00ff00"
            strokeWidth={30}
            strokeDasharray={820}
            strokeDashoffset={progressValue}
          />
        </svg>
      </section>
      <div className="absolute w-50 h-20 grid items-center justify-center top-47 left-25 left text-6xl font-black text-white ">
        <h1> {Math.floor(((820 - progressValue) * 100) / 820)}% </h1>
      </div>
      <section className="w-full px-2 justify-center space-x-10 flex">
        <button
          onClick={() => startProgress(false)}
          className=" shadow-md active:shadow-2xs shadow-black rounded-full bg-green-500 w-30 h-10 cursor-pointe"
        >
          setInterval()
        </button>
        <button
          onClick={pauseProgress}
          className="shadow-md active:shadow-2xs shadow-black rounded-full bg-red-500 w-30 h-10 cursor-pointer"
        >
          setTimeout()
        </button>
      </section>
    </main>
  );
}
