"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState("");

  return (
    <main className="relative flex h-full w-full items-center justify-center bg-black">
      <div>
        The Parent component
        <CardComponent prop={data} />
      </div>
    </main>
  );
}

function CardComponent({ prop }: { prop: string }) {
  return (
    <div>
      <CardContent prop={prop} />
      The child component
    </div>
  );
}

function CardContent({ prop }: { prop: string }) {
  const data = prop;
  return <div> This is an inner child component </div>;
}
