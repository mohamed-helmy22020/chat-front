import Image from "next/image";
import React from "react";

const ConversationMessage = () => {
  return (
    <div className="flex items-start">
      <Image
        width={40}
        height={40}
        src="https://randomuser.me/api/portraits/women/44.jpg"
        className="rounded-full border-2 border-white dark:border-slate-800"
        alt="user-1"
      />
      <div className="ms-2">
        <div className="message-bubble bg-white px-4 py-2 shadow-sm dark:bg-slate-600">
          <p className="text-sm">Hey there! How are you doing?</p>
        </div>
        <p className="mt-1 ml-1 text-xs text-slate-500 dark:text-slate-400">
          10:30 AM
        </p>
      </div>
    </div>
  );
};

export default ConversationMessage;
