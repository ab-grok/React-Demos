"use client";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";

export default function Home() {
  const [, refresh] = useState(0);

  const [stateValue, setStateValue] = useState("");
  const ref = useRef("");

  function setState() {
    const date = new Date().toLocaleString();
    setStateValue((p) => (p ? p + `\n${date}` : date));
  }

  function mutateRef() {
    const date = new Date().toLocaleString();
    ref.current = ref.current ? ref.current + `\n${date}` : date;
  }

  function showRef() {
    refresh((p) => p + 1);
  }

  return (
    <main className="relative flex h-full w-full items-center justify-center space-y-2 bg-black">
      <div className="box-shadow relative flex size-120 flex-col justify-center rounded-xl border-b-4 border-white/10 bg-stone-700 p-4 py-2 shadow-white/10">
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
              height={300}
              width={210}
              defaultLanguage="json"
              value={stateValue}
              theme="vs-dark"
              className="border-box-shadow overflow-hidden rounded-lg border-2"
            ></Editor>
            <button
              onClick={setState}
              className="z-10 h-10 w-30 rounded-lg bg-linear-to-b from-yellow-400 to-yellow-800 font-black text-black shadow-md shadow-gray-900/60 transition-all duration-100 hover:scale-102 hover:from-yellow-400 hover:to-yellow-200 active:translate-y-0.5 active:shadow-none"
            >
              set State
            </button>
          </section>
          <section className="flex flex-col items-center justify-center space-y-2">
            <Editor
              options={{
                readOnly: true,
                wordWrap: "on",
                lineNumbers: "off",
                minimap: { enabled: false },
              }}
              height={300}
              width={210}
              defaultLanguage="json"
              value={ref.current}
              theme="vs-dark"
              className="border-box-shadow overflow-hidden rounded-lg border-2"
            ></Editor>
            <button
              onClick={mutateRef}
              className="z-10 h-10 w-30 rounded-lg bg-linear-to-b from-yellow-400 to-yellow-800 font-black text-black shadow-md shadow-gray-900/60 transition-all duration-100 hover:scale-102 hover:from-yellow-400 hover:to-yellow-200 active:translate-y-0.5 active:shadow-none"
            >
              mutate Ref
            </button>
          </section>
        </div>
        <section className="flex h-auto w-auto items-center justify-center p-4">
          <button
            onClick={showRef}
            className="z-10 h-10 w-30 rounded-lg bg-linear-to-b from-green-400 to-green-800 font-black text-black shadow-md shadow-gray-900/60 transition-all duration-100 hover:scale-102 hover:from-green-400 hover:to-green-200 active:translate-y-0.5 active:shadow-none"
          >
            show Ref
          </button>
        </section>
      </div>
    </main>
  );
}
