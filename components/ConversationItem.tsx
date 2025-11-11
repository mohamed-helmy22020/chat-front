import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { formatDateToStatus } from "@/lib/utils";

const ConversationItem = () => {
  return (
    <div className="rounded-sm select-none hover:bg-gray-800">
      <Button
        className="flex h-full w-full cursor-pointer justify-start gap-3 rounded-sm px-2 py-3"
        variant="ghostFull"
      >
        <div className="relative flex min-h-9 min-w-9 items-center justify-center rounded-full">
          <Image
            className="rounded-full object-cover"
            src={"/imgs/user.jpg"}
            alt="avatar"
            fill
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-sm capitalize">Mohamed Helmy</h2>
            <p className="line-clamp-1 text-xs text-gray-500">
              {formatDateToStatus("10/10/2025")}
            </p>
          </div>
          <div className="max-w-full truncate font-light">
            hi how are u right now i wanted to tell u that i need your help in
            something
          </div>
        </div>
      </Button>
    </div>
  );
};

export default ConversationItem;
