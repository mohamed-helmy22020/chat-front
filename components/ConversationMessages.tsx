import React from "react";
import { LuFile } from "react-icons/lu";
import ConversationMessage from "./ConversationMessage";

const ConversationMessages = () => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-site-background p-4">
      <div className="mt-5 space-y-3">
        <ConversationMessage />
        <ConversationMessage />
        <ConversationMessage />
        <ConversationMessage />
        <ConversationMessage />
        <div className="flex items-start">
          <div className="w-10"></div>
          <div className="ms-2">
            <div className="message-bubble bg-white px-4 py-2 shadow-sm dark:bg-slate-600">
              <p className="text-sm">Hey there! How are you doing?</p>
            </div>
            <p className="mt-1 ml-1 text-xs text-slate-500 dark:text-slate-400">
              10:30 AM
            </p>
          </div>
        </div>
        <div className="flex items-start justify-end">
          <div>
            <div className="message-bubble self bg-mainColor-100 px-4 py-2 shadow-sm dark:bg-mainColor-900">
              <p className="text-sm">
                I am doing great! Just finished that project we were working on.
              </p>
            </div>
            <p className="mt-1 mr-1 text-right text-xs text-slate-500 dark:text-slate-400">
              10:32 AM
            </p>
          </div>
        </div>
        <ConversationMessage />
        <div className="flex items-start justify-end">
          <div>
            <div className="message-bubble self bg-mainColor-100 px-4 py-2 shadow-sm dark:bg-mainColor-900">
              <div className="flex items-center space-x-2">
                <LuFile className="h-5 w-5 text-mainColor-600 dark:text-mainColor-400" />
                <div>
                  <p className="text-sm font-medium">Project_Final.zip</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    24.5 MB
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-1 mr-1 text-right text-xs text-slate-500 dark:text-slate-400">
              10:35 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationMessages;
