import Image from "next/image";
import React from "react";
import { LuPhone, LuVideo } from "react-icons/lu";

const ConversationHeader = () => {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-site-foreground p-4 dark:border-slate-700">
      <div className="flex items-center">
        <Image
          width={40}
          height={40}
          src="https://randomuser.me/api/portraits/women/44.jpg"
          className="rounded-full border-2 border-white dark:border-slate-800"
          alt="user-1"
        />
        <div className="ml-3">
          <p className="font-medium">Sarah Johnson</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuPhone className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuVideo className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
