import React from "react";
import { LuPaperclip, LuSend, LuSmile } from "react-icons/lu";

const ConversationFooter = () => {
  return (
    <div className="border-t border-slate-200 bg-site-foreground p-3 dark:border-slate-700">
      <div className="flex items-center">
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuPaperclip className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <button className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LuSmile className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="mx-2 flex-1 rounded-full bg-site-background px-4 py-2 focus:ring-2 focus:ring-mainColor-500 focus:outline-none"
        />
        <button className="cursor-pointer rounded-full bg-mainColor-600 p-2 text-white hover:bg-mainColor-700">
          <LuSend className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ConversationFooter;
