"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const bubbles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [loadAPI, setLoadAPI] = useState(0);
  const [catFact, setCatFact] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [mouseLeft, setMouseLeft] = useState(false);

  useEffect(() => {
    if (!loadAPI) return;
    (async () => {
      const res = await fetch("https://catfact.ninja/fact");
      const catFact = await res.json();
      setCatFact(catFact.fact);
    })();
  }, [loadAPI]);

  useEffect(() => {
    if (!mainRef.current) return;

    mainRef.current.addEventListener("mousemove", onMouseMove);
    mainRef.current.addEventListener("mouseleave", onMouseLeave);
    return () => {
      mainRef.current?.removeEventListener("mousemove", onMouseLeave);
      mainRef.current?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  function onMouseMove(e: MouseEvent) {
    setMouseLeft(false);
    const rect = mainRef.current!.getBoundingClientRect();
    rectRef.current = rect;
    const x = e.clientX - rect.left - 40;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  }

  function onMouseLeave(e: MouseEvent) {
    setMouseLeft(true);
    setMousePosition({ x: 200, y: 300 });
  }

  return (
    <main className="relative flex h-full w-full items-center justify-center space-y-2 bg-black">
      <div className="box-shadow relative flex size-120 flex-col justify-center rounded-full border-t-2 border-white/10 bg-stone-700 p-4 shadow-white/10">
        <section
          className={` ${catFact ? "opacity-100" : "opacity-0"} border-background mt-10 flex h-60 w-auto items-center justify-center space-y-2 rounded-full border-2 bg-white p-4 font-bold text-wrap shadow-md`}
        >
          {catFact}
        </section>
        <section className="flex h-auto w-auto items-center justify-center p-4">
          <button
            onClick={() => setLoadAPI(Math.random())}
            className="z-10 h-10 w-1/3 rounded-lg bg-linear-to-b from-green-700 to-green-800 font-black text-black shadow-md shadow-gray-900 transition-all duration-100 hover:from-violet-400 hover:to-pink-500 active:translate-y-0.5 active:shadow-none"
          >
            Load page
          </button>
        </section>
        <section
          ref={mainRef}
          className="absolute top-1/100 left-1/100 flex h-98/100 w-98/100 flex-1 rounded-full pl-4"
        >
          {bubbles.map((b, i) => {
            return (
              <motion.div
                key={i}
                className="absolute rounded-full border-t-2 border-r-2 border-white/70 bg-blue-500 bg-linear-to-br from-blue-950 to-blue-500"
                style={{
                  width: 30 + (i || 0.5),
                  height: 30 + (i || 0.5),
                }}
                initial={{ x: (i || 0.1) * 50, y: 300 }}
                animate={
                  mouseLeft
                    ? { x: (i || 0.1) * 50, y: 300 }
                    : {
                        x:
                          mousePosition.x + i * 20 + 150 >
                          (rectRef.current?.right ?? 0)
                            ? mousePosition.x + i * 20 - 200
                            : mousePosition.x + i * 20,
                        y: mousePosition.y,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 5 * (10 - (i || 0.5)),
                  damping: 1,
                  duration: 1000 * (i || 0.5),
                }}
              ></motion.div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
