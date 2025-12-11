"use client";
import { usePageStore } from "@/store/pageStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";
import BlockedList from "./BlockedList";
import Chat from "./Chat";
import FriendsList from "./FriendsList";
import Loading from "./Loading";
import Profile from "./Profile";
import SettingsComponent from "./Settings";
import Status from "./Status";

const RenderPage = () => {
  const { isLoadingData } = useSettingsStore(
    useShallow((state) => ({
      isLoadingData: state.isLoadingData,
      loadingProgress: state.loadingProgress,
    })),
  );
  const { page } = usePageStore(
    useShallow((state) => ({
      page: state.page,
    })),
  );
  console.log({ isLoadingData });

  if (isLoadingData) {
    return <Loading />;
  }

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
