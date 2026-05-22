"use client";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";

export default function Home() {
  const adviceAPI = "https://api.adviceslip.com/advice";

  const [advice, setAdvice] = useState("");

  async function asyncAwait() {
    setAdvice("");
    const result = await fetch(adviceAPI);
    const data = await result.json();
    setAdvice(JSON.stringify(data.slip, null, 2));
  }

  function thenChain() {
    setAdvice("");
    fetch(adviceAPI)
      .then((result) => result.json())
      .then((data) => setAdvice(JSON.stringify(data.slip, null, 2)));
  }

  function noAwait() {
    setAdvice("");
    fetch(adviceAPI).then((result) => setAdvice(result.json().toString()));
  }

  return (
    <main className="relative flex h-full w-full items-center justify-center space-y-2 bg-black">
      <div className="box-shadow relative flex size-120 flex-col justify-center rounded-xl border-2 border-stone-700 p-4 py-2 shadow-white/10">
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
              height={350}
              width={444}
              defaultLanguage="json"
              value={advice}
              theme="vs-dark"
              className="border-box-shadow/50 overflow-hidden rounded-lg border-2"
            />
          </section>
        </div>
        <section className="flex h-auto w-auto items-center justify-between p-4">
          <button
            onClick={asyncAwait}
            className="z-10 h-15 w-30 rounded-lg bg-radial from-yellow-400 via-yellow-600 to-yellow-800/30 font-black text-black shadow-md shadow-gray-900/60 transition-all duration-500 hover:translate-x-2 hover:scale-102 hover:from-yellow-800 hover:via-yellow-400 hover:to-yellow-200 active:translate-y-0.5 active:shadow-none"
          >
            Run Async/Await
          </button>
          <button
            onClick={thenChain}
            className="z-10 h-15 w-30 rounded-lg bg-radial from-green-400 via-green-600 to-green-800/30 font-black text-black shadow-md shadow-gray-900/60 transition-all duration-500 hover:scale-102 hover:from-green-800 hover:via-green-400 hover:to-green-200 active:translate-y-0.5 active:shadow-none"
          >
            Run then()
          </button>
          <button
            onClick={noAwait}
            className="z-10 h-15 w-30 rounded-lg bg-radial from-blue-400 via-blue-600 to-blue-800/30 font-black text-black shadow-md shadow-gray-900/60 transition-all duration-500 hover:-translate-x-2 hover:scale-102 hover:from-blue-800 hover:via-blue-400 hover:to-blue-200 active:translate-y-0.5 active:shadow-none"
          >
            Run noAwait
          </button>
        </section>
      </div>
    </main>
  );
}
