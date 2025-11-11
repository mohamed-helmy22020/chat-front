import React from "react";
import { Input } from "./ui/input";

const ChatSearch = () => {
  return (
    <div className="px-5 pb-3">
      <Input className="rounded-sm" placeholder="Search for conversation." />
    </div>
  );
};

export default ChatSearch;
