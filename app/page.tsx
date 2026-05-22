"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Home as HomeIcon,
  User,
  MessageCircle,
  ThumbsUp,
  User as UserIcon,
} from "lucide-react";
import { useUserContext } from "./hooks/ContextProvider";

export default function Home() {
  const [expandInput, setExpandInput] = useState(false);

  const { comment, setComment } = useUserContext();

  return (
    <main className="relative flex h-full w-full items-center justify-center bg-linear-to-br from-black via-stone-900 to-black p-6">
      <div className="box-shadow to-stone-850 relative flex w-lg max-w-3xl flex-col items-center justify-center gap-6 rounded-4xl border border-stone-700 bg-linear-to-b from-stone-700 p-6 py-8 shadow-2xl">
        {/* Navbar */}
        <p className="text-heading1 absolute -top-10 z-10 text-lg">
          use <span className="text-heading2 text-xl">Context</span>
        </p>

        <Navbar />

        {/* Cards Section */}
        <section className="flex w-md flex-col gap-6 select-none">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-100">
              Recent Comments
            </h2>
            <span className="text-xs text-stone-500">
              {comment || "Context value in container"}
            </span>
          </div>

          <AnimatePresence>
            <UserCard />
          </AnimatePresence>
        </section>

        {/* Input Section */}
        <motion.section
          className={`relative flex h-24 w-full justify-center gap-5 rounded-3xl bg-stone-500/40 bg-linear-90 p-2 transition-all hover:bg-stone-500/60`}
          layout
        >
          <motion.span
            animate={expandInput ? { x: -120 } : { x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              damping: 10,
              stiffness: 80,
            }}
            className="z-5"
          >
            <Button
              className="bg-button1 hover:to-buttonHover active:to-buttonActive2 z-5 flex h-20 w-40 cursor-pointer items-center justify-center rounded-3xl bg-linear-90 px-6 text-lg font-semibold text-white shadow-none shadow-black transition-all duration-500 hover:scale-x-105 hover:shadow-xs active:shadow-none"
              onClick={() => setExpandInput(!expandInput)}
            >
              {expandInput ? "Post" : "Change Context"}
            </Button>
          </motion.span>
          <motion.div
            animate={
              expandInput ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
            }
            transition={{ duration: 0.6, type: "spring" }}
            className="absolute top-0 left-1/2 flex h-full items-center justify-center p-2"
          >
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What's on your mind?"
              className={`focus:ring-buttonHover1 flex h-full items-center justify-center rounded-3xl bg-stone-800/50 p-3 text-stone-100 placeholder-stone-500 ring-2 ring-stone-700 transition-all focus:bg-stone-800 focus:outline-none`}
            />
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}

function Navbar() {
  const { comment } = useUserContext();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scaleY: 1.05, animationDuration: 2 }}
      className="flex w-full items-center justify-between rounded-2xl bg-stone-500/30 px-6 py-1 backdrop-blur-sm select-none"
    >
      <div className="flex cursor-pointer items-center gap-2 rounded-3xl p-3 hover:bg-blue-300/10">
        <HomeIcon className="h-6 w-6 text-blue-400" />
        <span className="text-sm font-semibold text-stone-100">Home</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-full cursor-pointer items-center gap-2 rounded-3xl p-3 transition-colors hover:bg-blue-300/10">
          <User className="h-6 w-6 text-green-300" />
          <span className="text-sm font-semibold text-stone-100">Chris</span>
        </div>

        <div className="flex h-full cursor-pointer items-center gap-2 rounded-3xl p-3 transition-colors hover:bg-blue-300/10">
          <MessageCircle className="h-6 w-6 text-purple-400" />
          <span className="max-w-40 truncate text-sm font-semibold text-stone-100">
            {comment || "Context value in Navbar"}
          </span>
        </div>
      </div>
    </motion.nav>
  );
}

function UserCard() {
  const { comment } = useUserContext();

  const User = {
    username: "Christopher Washington",
    likes: 54,
    date: "2 hours ago",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="hover: w-full max-w-2xl rounded-2xl bg-stone-700 p-6 shadow-lg transition-all hover:bg-stone-600"
    >
      {/* Username Header with Icon */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
          <UserIcon className="h-7 w-7" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-stone-100"></h3>
          <p className="text-lg text-stone-400">{User.username}</p>
        </div>
      </div>

      {/* Message Section */}
      <div className="mb-6 flex gap-3">
        <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-purple-400" />
        <p className="text-base leading-relaxed text-stone-200">
          {" "}
          {comment || "Context value in card"}{" "}
        </p>
      </div>

      {/* Likes Section */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-3">
          <ThumbsUp className="h-5 w-5 shrink-0 text-rose-400" />
          <span className="flex gap-1 text-sm font-medium text-stone-300">
            {User.likes}
            <p className="text-stone-400">likes</p>
          </span>
        </div>
        <p className="flex text-xs text-stone-500">{User.date}</p>
      </div>
    </motion.div>
  );
}
