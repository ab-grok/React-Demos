"use client";

import { Button } from "@/components/ui/button";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { useEffect, useMemo, useState } from "react";

const stringArr = [
  "Starting to think",
  "Thinking a bit more",
  "Thinking even deeper",
  "Reaching a conclusion",
  "Final resolved thought",
];

export default function Home() {
  const [memoChanged, setMemoChanged] = useState(0);

  const [rendered, setRendered] = useState(-1); //incrementing this makes component rerender

  const recomputedValue = stringArr[rendered]; //this recomputes the a new array element each rerender

  const retainedValue = useMemo(() => {
    return stringArr[rendered]; //memoised array element
  }, [memoChanged]); //is recomputed only when memoChanged

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 20], [0, 1]);

  useEffect(() => {
    if (rendered < 0) return;

    animate(y, [0, 20], { type: "keyframes" });
    const time = setTimeout(() => {
      animate(y, [20, 0]);
    }, 1000);

    return () => clearTimeout(time);
  }, [rendered]);

  return (
    <main className="relative flex h-full w-full items-center justify-center bg-black">
      <div className="box-shadow relative flex h-3/4 w-120 max-w-170 flex-col justify-center gap-2 rounded-4xl border-2 border-stone-700 bg-red-600 bg-linear-150 from-white to-neutral-200 p-4 py-6 shadow-xl select-none">
        <section className="relative flex h-auto max-h-130 min-h-95 w-auto flex-col items-center justify-center gap-x-1 overscroll-none rounded-md font-semibold antialiased shadow-sm duration-500 hover:bg-white hover:shadow-black/20">
          <p className="absolute -top-20 text-lg text-purple-500">
            use <span className="text-xl text-purple-300/90">Memo</span>
          </p>

          <AnimatePresence>
            <motion.div
              style={{ y, opacity }}
              className="absolute -top-10 z-10 flex w-fit items-center gap-2 rounded-3xl bg-linear-180 from-transparent to-green-500 p-4 font-semibold shadow-sm shadow-black"
            >
              Component Rerendered
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-400/20 text-center font-semibold shadow-sm">
                {rendered + 1}
              </div>
            </motion.div>
          </AnimatePresence>

          <section className="flex flex-col items-center gap-4">
            <motion.div className="flex flex-col gap-4">
              <div className="flex h-40 w-110 flex-col items-center justify-center rounded-4xl p-2 shadow-sm">
                <div className="flex h-2/3 w-full items-center justify-center rounded-full bg-blue-300/70 px-4 text-lg shadow-sm">
                  {recomputedValue}
                </div>
                <span className="text-zinc-900/60"> Rerendered value </span>
              </div>
            </motion.div>
            <motion.div className="flex flex-col gap-4">
              <div className="flex h-40 w-110 flex-col items-center justify-center rounded-4xl p-2 shadow-sm">
                <div className="flex h-2/3 w-full items-center justify-center rounded-full bg-blue-300/70 px-4 text-lg shadow-sm">
                  {retainedValue}
                </div>
                <span className="text-zinc-900/60"> Memoised value </span>
              </div>
            </motion.div>
          </section>
        </section>
        <section
          className={`${false ? "hidden" : "visible"} element grid h-30 w-auto items-center justify-center overflow-y-scroll rounded-2xl bg-black/20 p-4`}
        >
          <div className="flex h-auto min-w-80 justify-center gap-8">
            <Button
              onClick={() => setRendered((r) => r + 1)}
              className="h-20 w-30 min-w-fit cursor-pointer rounded-xl bg-linear-to-r px-4 text-lg shadow-md transition-all hover:-translate-y-1 hover:bg-teal-300 hover:shadow-black active:from-teal-300 active:to-teal-600 active:shadow-none"
            >
              Rerender
            </Button>
            <Button
              onClick={() => setMemoChanged((s) => s + 1)}
              className="h-20 w-30 min-w-fit cursor-pointer rounded-xl bg-purple-400/20 bg-linear-to-r px-4 text-lg font-semibold shadow-md transition-all hover:-translate-y-1 hover:bg-teal-300 hover:shadow-black active:from-teal-300 active:to-teal-600 active:shadow-none"
            >
              Change memo dep
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
