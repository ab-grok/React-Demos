"use client";
import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [input, setInput] = useState<string | undefined>();
  const [output, setOutput] = useState<any>();

  function getString() {
    const arr: string[] = JSON.parse(input!);

    const output = arr.reduce((acc, str) => {
      return acc + " " + str;
    }, "");

    setOutput(output);
  }

  function getSum() {
    const arr: number[] = JSON.parse(input!);

    const output = arr.reduce((acc, num) => {
      return acc + num;
    }, 0);

    setOutput(output);
  }

  function getObject() {
    const arr: string[][] = JSON.parse(input!);

    const output = arr.reduce((acc, innerArr) => {
      return { ...acc, [innerArr[0]]: innerArr[1] };
    }, {});

    setOutput(output);
  }

  function getFunction() {
    const arr: string[] = JSON.parse(input!);

    const output: (x: string) => {} = arr.reduce(
      (acc, fn) => {
        const fn1: (x: string) => string = eval(fn);
        return (x) => acc(fn1(x));
      },
      (x) => x,
    );

    setOutput(output.toString());
  }

  return (
    <main className="relative grid mx-auto my-auto space-y-2 h-3/4 ">
      <section className="w-120 place-items-center h-50 p-2 grid mx-auto my-auto rounded-xl bg-neutral-800 box-shadow">
        <h4 className="text-white font-black">input</h4>
        <Editor
          height="99%"
          width="100%"
          theme="vs-dark"
          language="javascript"
          onChange={(value) => setInput(value)}
          value={input}
          options={{ minimap: { enabled: false } }}
        ></Editor>
      </section>

      <section className=" z-5 border-2 space-x-3 border-black/10 justify-center rounded-xl shadow-xl flex h-fit py-4 px-2">
        <button
          onClick={getString}
          className="shadow-md active:shadow-2xs active:scale-99 shadow-black font-black rounded-full bg-green-500 hover:bg-green-400 w-30 h-10 cursor-pointer"
        >
          Get string
        </button>
        <button
          onClick={getSum}
          className="shadow-md active:shadow-2xs active:scale-99 shadow-black rounded-full font-black bg-blue-500 hover:bg-blue-400 w-30 h-10 cursor-pointer"
        >
          Get sum
        </button>
        <button
          onClick={getObject}
          className="shadow-md active:shadow-2xs active:scale-99 shadow-black rounded-full font-black bg-red-500 hover:bg-red-400 w-30 h-10 cursor-pointer"
        >
          Get object
        </button>
        <button
          onClick={getFunction}
          className="shadow-md active:shadow-2xs active:scale-99 shadow-black rounded-full font-black bg-black hover:bg-white/10 text-white w-30 h-10 cursor-pointer"
        >
          Get function
        </button>
      </section>

      <section className="w-120 z-1 place-items-center h-50 p-2 grid mx-auto my-auto rounded-xl bg-neutral-800 green-box-shadow">
        <h4 className="text-white font-black">Output</h4>
        <Editor
          height="99%"
          width="100%"
          theme="vs-dark"
          className="rounded-2x bg-black"
          language="javascript"
          value={
            typeof output == "string"
              ? output.trim()
              : JSON.stringify(output, null, 2)
          }
          options={{ minimap: { enabled: false }, readOnly: true }}
        ></Editor>
      </section>
    </main>
  );
}
