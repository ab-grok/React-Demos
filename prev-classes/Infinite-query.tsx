"use client";

import { Button } from "@/components/ui/button";
import {
  animate,
  useTransform,
  motion,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { CgSpinner, CgSpinnerAlt } from "react-icons/cg";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const scrollableContainer = useRef<HTMLDivElement>(null);

  const { fetchNextPage, isFetchingNextPage, data, hasNextPage } = queryAPI();

  const notifications = useMemo(() => {
    return data?.pages.flatMap((p) => p.comments);
  }, [data?.pages]);

  const y = useMotionValue(0);
  const spinnerPull = useTransform(y, [0, 120], [0, 50]);
  const rotate = useTransform(y, [0, 120], [0, 480]);
  const opacity = useTransform(y, [0, 50], [0, 1]);

  //Animates 'y:0' and 'scrollDistance' on fetch end;
  useLayoutEffect(() => {
    if (!isFetchingNextPage) {
      animate(y, 0, { type: "spring", damping: 20, stiffness: 300 });
      if (scrollableContainer.current) {
        scrollableContainer.current.scrollTo({
          top: scrollableContainer.current.scrollTop - 30,
          behavior: "smooth",
        });
      }
      return;
    }
    fetchNextPage();
  }, [isFetchingNextPage, y]);

  function getScroll() {
    const scrollable = scrollableContainer.current;
    if (!scrollable) return { totalScrollDistance: 0, scrollableHeight: 1 };
    const rect = scrollable.getBoundingClientRect();
    const top = rect.top;
    const bottom = rect.bottom;

    const height = bottom - top; //scrollDistance + element height = total length scrolled
    const scrollDistance = Math.abs(scrollable.scrollTop);
    const totalScrollDistance = scrollDistance + height + 1; //original total scroll distance is -0.399 of 0
    const scrollableHeight = scrollable.scrollHeight;

    console.log({ totalScrollDistance, scrollableHeight });
    return { totalScrollDistance, scrollableHeight };
  }

  return (
    <main className="relative flex h-full w-full items-center justify-center bg-black">
      <div className="box-shadow relative flex h-3/4 w-120 max-w-170 flex-col justify-center gap-2 rounded-4xl border-2 border-stone-700 bg-red-600 bg-linear-150 from-white to-neutral-200 p-4 py-6 shadow-xl select-none">
        <section
          id="notification-container"
          className="relative flex h-auto max-h-130 min-h-95 w-auto flex-col items-center gap-x-1 overscroll-none rounded-md font-semibold antialiased shadow-xl duration-500 perspective-distant hover:bg-white hover:shadow-black/20"
        >
          <p className="absolute -top-20 text-lg text-white">
            Notifications{" "}
            <span className="text-sm text-white/90">
              Page {data?.pages.length || 0}
            </span>
          </p>

          <motion.div
            id="End-notification-card"
            className="absolute -top-10 z-5 flex h-20 w-full items-center justify-center rounded-2xl bg-cyan-700 shadow-2xs shadow-cyan-600"
            initial={{ y: 0, opacity: 0 }}
            animate={
              !hasNextPage && !isFetchingNextPage && notifications
                ? { y: 30, opacity: 1 }
                : { y: 0, opacity: 0 }
            } //need to have animate trigger on value, how do I get that?
            whileHover={{ y: 20 }}
          >
            {" "}
            End of list reached!{" "}
          </motion.div>
          <motion.div
            id="spinner"
            style={
              isFetchingNextPage
                ? { y: 10, rotate: 0, opacity: 1 }
                : { y: spinnerPull, rotate, opacity }
            } // y: translateY (vertical translation).
            animate={
              isFetchingNextPage
                ? {
                    rotate: 730,
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      type: "tween",
                    },
                  }
                : {}
            }
            transition={{ duration: 1, type: "spring" }}
            className="absolute -top-7 -z-5 flex w-full items-center justify-center"
          >
            <CgSpinnerAlt size={40} />
          </motion.div>
          <AnimatePresence initial={false}>
            <motion.div
              ref={scrollableContainer}
              layoutScroll //preserves scroll position (current element) on scrolHeight change
              transition={{ duration: 2, type: "spring" }}
              style={{ y }}
              // onScroll={(scroll) => {
              //   console.log("scrolling", scroll.currentTarget.scrollTop);
              // }}
              className="element flex flex-col-reverse space-y-1 overflow-y-scroll pl-2"
              drag="y" //allows drag on vertical axis
              onDrag={(e, info) => {
                const { totalScrollDistance, scrollableHeight } = getScroll();
                // console.log("info offset y", info.offset.y); //offset is distance from scroll start
                if (totalScrollDistance >= scrollableHeight) {
                  //clamp sets drag range.
                  const clamp = Math.min(70, Math.max(0, info.offset.y));
                  y.set(clamp);
                } else y.set(0);
              }}
              onDragEnd={(e, info) => {
                const { totalScrollDistance, scrollableHeight } = getScroll();
                if (
                  info.offset.y > 50 &&
                  totalScrollDistance >= scrollableHeight
                ) {
                  // y.set(0);
                  console.log("drag end reached");
                  fetchNextPage();
                } else y.set(0);
              }}
              // dragElastic={1.3}
              dragConstraints={{ top: 0, bottom: 0 }}
            >
              {notifications?.length &&
                notifications?.map((note, index) => (
                  <motion.div key={note.id + index} layout>
                    <NotificationCard
                      username={note.user.username}
                      fullName={note.user.fullName}
                      message={note.body}
                      likes={note.likes}
                      time={note.time}
                      id={note.id}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
        </section>
        <section
          className={`${notifications ? "hidden" : "visible"} element grid h-30 w-auto items-center justify-center overflow-y-scroll rounded-2xl bg-black/20 p-4`}
        >
          <div className="flex h-auto min-w-80 justify-center">
            <Button
              type="submit"
              className="h-20 w-50 min-w-fit cursor-pointer rounded-xl bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800 active:shadow-none"
            >
              Loading
              <CgSpinner className="animate-spin" />
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function NotificationCard({
  username,
  fullName,
  message,
  likes,
  time,
  id,
}: NotificationCardProps) {
  return (
    <div className="flex w-110 flex-col rounded-2xl bg-linear-to-b from-zinc-900 to-zinc-700 p-1 shadow-sm shadow-white">
      <div
        id="inner-container"
        className="flex flex-col rounded-2xl bg-blue-200/5 p-1"
      >
        {/* Username and Full Name - Grouped */}
        <div className="flex items-center justify-between rounded-2xl bg-white/20 px-4">
          <p className="text-lg font-bold text-blue-300">
            {username}
            <span className="block text-xs font-normal text-white opacity-75">
              ({fullName})
            </span>
          </p>
          <p id="gradient-text" className="flex items-center gap-2">
            {id}
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
          </p>
        </div>

        <div className="rounded-2xl py-1 transition-all duration-500 hover:shadow-md">
          {/* Message */}
          <div className="hver:shadow-md rounded-lg bg-linear-to-r px-3">
            <p className="text-lg text-white">
              <span className="text-sm opacity-60">Message:</span> {message}
            </p>
          </div>

          {/* Likes and Timestamp in a row */}
          <div className="relative left-3/5 flex w-2/5 justify-between gap-3 rounded-2xl bg-white px-3">
            <div className="bg-aaber-300 flex items-center rounded-lg bg-linear-to-r p-1">
              <span className="text-sm font-medium text-rose-900 hover:scale-101">
                ❤️ {likes} likes
              </span>
            </div>
            <div className="bg-bue-600 rounded-lg p-1">
              <span className="text-xs text-amber-900 hover:scale-105">
                {time}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function queryAPI() {
  const infiniteData = useInfiniteQuery<
    commentsData,
    Error,
    InfiniteData<commentsData>,
    [string, string],
    { cursor: number | undefined }
  >({
    queryKey: ["username", "notifications"],

    queryFn: async ({ pageParam }) => {
      const { cursor } = pageParam;
      const commentsData = await getNotificationData(cursor);
      return commentsData;
    },

    initialPageParam: { cursor: 320 },

    getNextPageParam: (lastPage) => {
      if (!lastPage.cursor) return undefined;
      return { cursor: lastPage.cursor };
    },

    getPreviousPageParam: (firstPage) => {
      return undefined;
    },

    staleTime: 1000 * 60 * 10,
  });

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    error,
    isRefetching,
    isError,
  } = infiniteData;

  return infiniteData;
}

async function getNotificationData(cursor?: number): Promise<commentsData> {
  if (!cursor) throw "No more pages";

  const API = `https://dummyjson.com/comments?limit=5&skip=${cursor}`;
  const res = await fetch(API);

  let { comments } = await res.json();
  const time = new Date().toLocaleTimeString();

  cursor = comments.length ? cursor + 5 : 0;
  comments = (comments as comment[]).map((c) => ({ ...c, time }));
  return { comments, cursor };
}

type comment = {
  id: number;
  body: string;
  likes: number;
  user: { username: string; fullName: string };
  time: string;
};

type commentsData = {
  comments: comment[];
  cursor: number;
};

type NotificationCardProps = {
  username: string;
  fullName: string;
  message: string;
  likes: number;
  time: string;
  id: number;
};
