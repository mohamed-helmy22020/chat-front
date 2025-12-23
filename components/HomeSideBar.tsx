"use client";
import { cn } from "@/lib/utils";
import {
  LuCircleDotDashed,
  LuMessageSquareText,
  LuSettings,
  LuUser,
  LuUserRoundX,
  LuUsers,
} from "react-icons/lu";

import useGetAllData from "@/hooks/useGetAllData";
import usePageFocus from "@/hooks/usePageFocus";
import useSocketConnection from "@/hooks/useSocketConnection";
import { getGroupData as getGroupDataAction } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import { PageType, usePageStore } from "@/store/pageStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineGroups } from "react-icons/md";
import { useShallow } from "zustand/react/shallow";
import JoinGroupDialog from "./JoinGroupDialog";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
type Props = {
  userProp?: UserType;
};
const HomeSideBar = ({ userProp }: Props) => {
  const [joinGroup, setJoinGroup] = useState<ConversationType | null>(null);
  const { changeUserData } = useUserStore(
    useShallow((state) => ({
      changeUserData: state.changeUserData,
    })),
  );
  const { conversations, changeCurrentConversation } = useChatStore(
    useShallow((state) => ({
      conversations: state.conversations,
      changeCurrentConversation: state.changeCurrentConversation,
    })),
  );
  const isLoadingData = useSettingsStore((state) => state.isLoadingData);
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (userProp) {
      changeUserData(userProp);
    }
  }, [userProp, changeUserData]);

  useEffect(() => {
    if (isLoadingData || !groupId || !token) return;

    const getGroupData = async () => {
      try {
        const res = await getGroupDataAction(groupId, token);
        console.log({ res });
        if (!res.success) {
          throw new Error(res.msg);
        }
        window.history.replaceState(null, "", "/");
        const existConversation = conversations.find(
          (c) => c.id === res.group.id,
        );
        if (existConversation) {
          changeCurrentConversation(existConversation);
          return;
        }
        setJoinGroup({
          ...res.group,
          groupSettings: {
            linkToken: token,
          },
        });
      } catch (error) {
        console.error(error);
      }
    };
    getGroupData();
  }, [groupId, token, isLoadingData, conversations, changeCurrentConversation]);
  usePageFocus();
  useSocketConnection();
  useGetAllData();

  return (
    <>
      <JoinGroupDialog group={joinGroup} setJoinGroup={setJoinGroup} />
      <div className="flex flex-col overflow-hidden border-e border-slate-300 bg-site-foreground px-2 py-3.5 dark:border-slate-800">
        <div className="flex flex-col items-center justify-center">
          <SideBarButton Icon={LuMessageSquareText} page="chat" />
          <SideBarButton Icon={LuCircleDotDashed} page="status" />
          <SideBarButton Icon={LuUsers} page="friends" />
          <SideBarButton Icon={LuUserRoundX} page="blocks" />
          <SideBarButton Icon={MdOutlineGroups} page="groups" />
        </div>
        <div className="flex-1">
          <Separator />
        </div>
        <div className="flex flex-col">
          <SideBarButton Icon={LuSettings} page="settings" />
          <SideBarButton Icon={LuUser} page="profile" />
        </div>
      </div>
    </>
  );
};

const SideBarButton = ({
  Icon,
  page,
}: {
  Icon: React.ComponentType<{ size?: number }>;
  page: PageType;
}) => {
  const t = useTranslations("SideBar");
  const { currentPage, setPage } = usePageStore(
    useShallow((state) => ({
      currentPage: state.page,
      setPage: state.setPage,
    })),
  );
  const isActive = page === currentPage;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "mb-2 cursor-pointer rounded-full p-2 text-gray-700 dark:text-gray-400 dark:hover:bg-site-background",
            {
              "text-black dark:text-white": isActive,
              "bg-site-background": isActive,
            },
          )}
          onClick={() => setPage(page)}
        >
          <Icon size={24} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="rounded-full" side="left" sideOffset={5}>
        <p className="capitalize select-none">{t(page)}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default HomeSideBar;
