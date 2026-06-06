"use client";
import { Editor } from "@monaco-editor/react";
import { isDate } from "node:util/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [timeClicked, setTimeClicked] = useState(0);
  const buttons = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttons.current) return;

    const handleScroll = (e: MouseEvent) => {
      const x = e.clientX;
      const bounds = buttons.current?.getBoundingClientRect();
      const cursorPos = x - bounds!.left;

      //get 20% element width px
      const width = bounds!.right - bounds!.left;
      const scrollStart = (width * 20) / 100;

      if (cursorPos > scrollStart) {
        if (cursorPos > scrollStart + 10)
          buttons.current!.scrollTo({
            behavior: "smooth",
            left: cursorPos * 1.2,
          });
        else
          buttons.current!.scrollTo({
            behavior: "smooth",
            left: 0,
          });
      }
    };

    buttons.current.addEventListener("mousemove", handleScroll);
    return () =>
      buttons.current?.removeEventListener("mousemove", handleScroll);
  }, []);

  function handleClick() {
    setTimeClicked((t) => {
      if (!input.trim()) {
        setOutput("");
        return 0;
      }

      console.log({ input });
      // const date = handleInput(input);
      const relativeStr = formatRelativeTime(input);
      setOutput(relativeStr);
      return t;
    });
    console.log(timeClicked);
  }

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function toString() {
    setOutput((o) => o + "\nString: \t" + new Date().toString());
  }
  function toLocaleString() {
    setOutput((o) => o + "\nLocale: \t" + new Date().toLocaleString());
  }
  function toUTCString() {
    setOutput((o) => o + "\nUTC: \t\t" + new Date().toUTCString());
  }
  function toISOString() {
    setOutput((o) => o + "\nISO: \t\t" + new Date().toISOString());
  }

  return (
    <main className="relative flex h-full w-full items-center justify-center space-y-2 bg-black">
      <div className="box-shadow relative flex size-120 flex-col justify-center gap-2 rounded-xl border-2 border-stone-700 bg-red-400 bg-linear-150 from-white/90 to-stone-300 p-4 py-2 pb-6 shadow-xl shadow-green-400">
        <div
          className={`mt-5 flex w-auto flex-1 items-center justify-between space-y-2 overflow-hidden rounded-xl font-bold text-wrap shadow-md`}
        >
          <section className="flex flex-col items-center justify-center space-y-2 pt-1">
            <Editor
              options={{
                readOnly: true,
                wordWrap: "on",
                lineNumbers: "off",
                minimap: { enabled: false },
              }}
              height={230}
              width={444}
              defaultLanguage="python"
              value={output}
              theme="vs-dark"
              className="border-box-shadow/50 overflow-hidden rounded-lg"
            />
          </section>
        </div>
        <section className="flex h-auto w-auto items-center justify-between rounded-md bg-black/30 p-4 hover:ring-2">
          <div className="flex min-w-80 gap-x-3">
            <button
              onClick={handleClick}
              className="line-clamp-3 max-h-fit min-h-20 max-w-20 min-w-30 rounded-sm bg-linear-to-r px-2 wrap-break-word whitespace-normal hover:scale-101 hover:bg-cyan-600 active:from-green-600"
            >
              {!input ? "Relative Time" : "Format " + input}
            </button>
            <div
              ref={buttons}
              className="element flex w-70 gap-1 overflow-x-scroll rounded-md px-2 font-bold"
            >
              <button
                onClick={toString}
                className="min-w-fit cursor-pointer rounded-sm bg-amber-600/20 bg-linear-to-r px-2 transition-all hover:bg-amber-600 active:to-green-500"
              >
                {" "}
                toString{" "}
              </button>
              <button
                onClick={toUTCString}
                className="min-w-fit cursor-pointer rounded-sm bg-purple-600/20 bg-linear-to-r px-2 transition-all hover:bg-purple-600 active:to-green-500"
              >
                {" "}
                toUTCString{" "}
              </button>
              <button
                onClick={toLocaleString}
                className="min-w-fit cursor-pointer rounded-sm bg-pink-600/20 bg-linear-to-r px-2 transition-all hover:bg-pink-600 active:to-green-500"
              >
                {" "}
                toLocaleString{" "}
              </button>
              <button
                onClick={toISOString}
                className="min-w-fit cursor-pointer rounded-sm bg-lime-600/20 bg-linear-to-r px-2 transition-all hover:bg-lime-600 active:to-green-500"
              >
                {" "}
                toISOString{" "}
              </button>
            </div>
          </div>
        </section>
        <section className="border-box-shadow flex h-18 items-center rounded-md bg-black/30 px-2">
          <textarea
            name="text"
            id="relativeTime"
            onChange={handleInputChange}
            value={input}
            className={`${timeClicked == 1 ? "opacity:100" : "opacity: 10"} h-4/5 w-full rounded-md p-3 pt-4 text-center font-black hover:bg-black/40 hover:ring-2`}
          ></textarea>
        </section>
      </div>
    </main>
  );
}

function formatRelativeTime(date: string) {
  const prevDate = new Date(date);
  const miliDiff = new Date().getTime() - prevDate.getTime();
  const secDiff = Math.floor(miliDiff / 1000);
  const minDiff = Math.floor(secDiff / 60);
  const hourDiff = Math.floor(minDiff / 60);
  const dayDiff = Math.floor(hourDiff / 24);
  const monthDiff = Math.floor(dayDiff / 30);
  const yearDiff = Math.floor(dayDiff / 365);

  if (yearDiff >= 1) return `${yearDiff} year(s) ago`;
  if (monthDiff >= 1) return `${monthDiff} month(s) ago`;
  if (dayDiff >= 1) return `${dayDiff} day(s) ago`;
  if (hourDiff >= 1) return `${hourDiff} hour(s) ago`;
  if (minDiff >= 1) return `${minDiff} min(s) ago`;
  if (secDiff >= 1) return `${secDiff} sec(s) ago`;
  return `just now`;
}

function handleInput(text: string) {
  const parts = text.match(/^([-+]?)(\d+)\s(\w)/);
  console.log(parts);
  const number = parseInt(parts![2]);
  const periodPart = parts![3];

  const date = new Date();
  if (periodPart == "d") date.setHours(date.getHours() - number * 24);
  if (periodPart == "h") date.setHours(date.getHours() - number);
  if (periodPart == "M") date.setMonth(date.getMonth() - number);
  if (periodPart == "m") date.setMinutes(date.getMinutes() - number);
  if (periodPart == "y") date.setFullYear(date.getFullYear() - number);

  return date;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/\//g, "-");
}
