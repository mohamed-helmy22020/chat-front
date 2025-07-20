"use client";
import { useState } from "react";
import Chat from "./Chat";
import FriendsList from "./FriendsList";
import HomeSideBar from "./HomeSideBar";
import Status from "./Status";

const HomePage = () => {
  const [page, setPage] = useState("chat");

  return (
    <div className="flex min-h-screen overflow-hidden">
      <HomeSideBar setPage={setPage} page={page} />
      {page === "chat" && <Chat />}
      {page === "status" && <Status />}
      {page === "friends" && <FriendsList />}
      {page === "blocks" && <Status />}
      {page === "settings" && <Status />}
      {page === "profile" && <Status />}
    </div>
  );
};

export default HomePage;
