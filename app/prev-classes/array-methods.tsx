"use client";

import { useEffect, useRef, useState } from "react";

const usersArr = [
  {
    id: 1,
    name: "Alice",
    age: 28,
    hobbies: ["reading", "cycling", "gardening"],
  },
  {
    id: 2,
    name: "Bob",
    age: 34,
    hobbies: ["gaming", "hunting"],
  },
  {
    id: 3,
    name: "White",
    age: 22,
    hobbies: ["coding", "chess", "singing"],
  },
  {
    id: 4,
    name: "Diana",
    age: 29,
    hobbies: ["Archery", "Mothering"],
  },
  {
    id: 5,
    name: "Ethan",
    age: 40,
    hobbies: ["photography", "painting", "swimming"],
  },
];

export default function Home() {
  const buttons = useRef<HTMLElement>(null);
  const cards = useRef<HTMLDivElement>(null);
  const [method, setMethod] = useState("map");
  const [users, setUsers] = useState([] as typeof usersArr);

  useEffect(() => {
    function cardsHover(e: MouseEvent) {
      const bounds = cards.current!.getBoundingClientRect();
      const relativeCursorPos = e.clientX - bounds.left;
      const ratio = relativeCursorPos / bounds.width; //from 0 - 1

      const rotation = (ratio - 0.5) * 40; //-20 to 20 degs

      const children = cards.current!.children;
      for (const card of children) {
        (card as HTMLElement).style.transform = `rotateY(${rotation}deg)`;
      }
    }

    cards.current?.addEventListener("mousemove", cardsHover);
    return () => cards.current?.removeEventListener("mousemove", cardsHover);
  }, []);

  useEffect(() => {
    function buttonsHover(e: MouseEvent) {
      const y = e.clientY;
      const bounds = buttons.current!.getBoundingClientRect();
      const relativeCursorPos = y - bounds.top;
      const lowerMidPointY = (70 * bounds.height) / 100;
      const upperMidPointY = (20 * bounds.height) / 100;
      if (relativeCursorPos > lowerMidPointY)
        buttons.current!.scrollTo({ top: y * 1.5, behavior: "smooth" });
      else if (relativeCursorPos < upperMidPointY)
        buttons.current!.scrollTo({ top: 0, behavior: "smooth" });
    }
    buttons.current?.addEventListener("mousemove", buttonsHover);
    return () =>
      buttons.current?.removeEventListener("mousemove", buttonsHover);
  }, []);

  function map() {
    console.log({ name: "usersArr", usersArr });
    console.log({ name: "users", users });
    setUsers(usersArr);
  }

  function flatMap() {
    const flatUsers = [users, users, users];
    setUsers(flatUsers.flatMap((users) => users));
  }

  function filter() {
    setUsers(users.filter((user) => user.age > 30));
  }

  function find() {
    console.log(users);
    const Ethan = users.find((user) => user.name == "Ethan");
    setUsers([Ethan!]);
  }

  function concat() {
    const Michael = {
      id: 6,
      name: "Michael",
      age: 26,
      hobbies: ["Singing", "Dancing"],
    };

    setUsers(users.concat(Michael));
  }

  function slice() {
    setUsers(users.slice(0, 1));
  }

  function push() {
    console.log("Push ran");
    const Paul = {
      id: 7,
      name: "Paul",
      age: 31,
      hobbies: ["Football", "Running"],
    };

    setUsers((users) => {
      const users1 = [...users];
      users1.push(Paul);
      return users1;
    });
  }

  function pop() {
    const users1 = [...users];
    users1.pop();
    setUsers(users1);
  }

  function spliceRemove() {
    const users1 = [...users];
    users1.splice(1);
    setUsers(users1);
  }

  function spliceAdd() {
    const users1 = [...users];
    users1.splice(1, 0, ...usersArr.slice(0, 3));
    setUsers(users1);
  }

  function sort() {
    const users1 = [...users];
    users1.sort((a, b) => a.age - b.age);
    setUsers(users1);
  }

  return (
    <main className="relative flex h-full w-full items-center justify-center bg-black">
      <div className="box-shadow relative flex size-120 w-full max-w-170 flex-col justify-center gap-2 rounded-xl border-2 border-stone-700 bg-linear-150 from-neutral-600 to-neutral-300 p-4 py-6 shadow-xl">
        <div
          ref={cards}
          className="flex w-auto flex-1 items-center gap-x-1 rounded-xl font-bold antialiased shadow-md perspective-distant"
        >
          {users.map((user, index) => (
            <div
              key={index}
              className="flex h-full w-40 flex-col gap-1 rounded-md bg-linear-90 from-zinc-800 via-zinc-900 to-stone-900 p-3 font-sans shadow-md"
            >
              {/* Name */}
              <p className="mb-2 font-sans text-lg font-bold text-white drop-shadow">
                {user.name}
              </p>

              <div className="mt-1 flex flex-col gap-1 font-sans text-sm">
                {/* ID */}
                <span className="font-light text-sky-200">
                  <span className="-font-sans opacity-70">id:</span> {user.id}
                </span>

                {/* Age */}
                <span className="font-sans font-light text-amber-300">
                  <span className="opacity-70">age:</span> {user.age}
                </span>

                {/* Hobbies */}
                <div className="mt-0.5 rounded-md py-1 font-sans shadow-md">
                  <span className="mb-0.5 flex flex-col gap-y-2 font-bold text-emerald-500">
                    hobbies:
                  </span>
                  <ul className="flex flex-col gap-0.5 pl-2">
                    {user.hobbies.map((hobby, i) => (
                      <li
                        key={i}
                        className="truncate font-normal text-emerald-300"
                      >
                        • {hobby}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <section
          ref={buttons}
          className="element grid h-30 w-auto items-center justify-center overflow-y-scroll rounded-md bg-black/30 p-4"
        >
          <div className="flex min-w-80 justify-center">
            <button
              onClick={map}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800"
            >
              map()
            </button>
            <button
              onClick={flatMap}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800"
            >
              flatMap()
            </button>
            <button
              onClick={filter}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800"
            >
              filter()
            </button>
            <button
              onClick={find}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800"
            >
              find()
            </button>
            <button
              onClick={concat}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800"
            >
              concat()
            </button>
            <button
              onClick={slice}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800"
            >
              slice
            </button>
          </div>
          <div className="flex min-w-80 justify-center">
            <button
              onClick={push}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-blue-600 hover:shadow-black active:from-blue-700 active:to-blue-900"
            >
              push()
            </button>
            <button
              onClick={pop}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-blue-600 hover:shadow-black active:from-blue-700 active:to-blue-900"
            >
              pop()
            </button>
            <button
              onClick={spliceRemove}
              className="line-clamp-1 h-20 w-29 cursor-pointer rounded-sm bg-linear-to-r px-4 wrap-break-word whitespace-normal shadow-md transition-all hover:-translate-y-1 hover:bg-blue-600 hover:shadow-black active:from-blue-700 active:to-blue-900"
            >
              splice() remove
            </button>
            <button
              onClick={spliceAdd}
              className="line-clamp-1 h-20 w-28 cursor-pointer rounded-sm bg-linear-to-r px-4 wrap-break-word whitespace-normal shadow-md transition-all hover:-translate-y-1 hover:bg-blue-600 hover:shadow-black active:from-blue-700 active:to-blue-900"
            >
              splice() add
            </button>
            <button
              onClick={sort}
              className="line-clamp-3 h-20 max-w-20 min-w-fit cursor-pointer rounded-sm bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-blue-600 hover:shadow-black active:from-blue-700 active:to-blue-900"
            >
              sort()
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
