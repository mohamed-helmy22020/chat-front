"use client";
import { usePageStore } from "@/store/pageStore";
import { useShallow } from "zustand/react/shallow";
import BlockedList from "./BlockedList";
import Chat from "./Chat";
import FriendsList from "./FriendsList";
import Profile from "./Profile";
import SettingsComponent from "./Settings";
import Status from "./Status";

const RenderPage = () => {
  const { page } = usePageStore(
    useShallow((state) => ({
      page: state.page,
    })),
  );
  return (
    <>
      {page === "chat" && <Chat />}
      {page === "status" && <Status />}
      {page === "friends" && <FriendsList />}
      {page === "blocks" && <BlockedList />}
      {page === "settings" && <SettingsComponent />}
      {page === "profile" && <Profile />}
    </>
  );
};

export default RenderPage;
