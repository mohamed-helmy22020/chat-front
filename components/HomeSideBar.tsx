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
import { PageType, usePageStore } from "@/store/pageStore";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
type Props = {
  userProp?: UserType;
};
const HomeSideBar = ({ userProp }: Props) => {
  const { changeUserData } = useUserStore(
    useShallow((state) => ({
      changeUserData: state.changeUserData,
    })),
  );
  useEffect(() => {
    if (userProp) {
      changeUserData(userProp);
    }
  }, [userProp, changeUserData]);

  usePageFocus();
  useSocketConnection();
  useGetAllData();

  return (
    <div className="flex flex-col overflow-hidden border-e border-slate-300 bg-site-foreground px-2 py-3.5 dark:border-slate-800">
      <div className="flex flex-col items-center justify-center">
        <SideBarButton Icon={LuMessageSquareText} page="chat" />
        <SideBarButton Icon={LuCircleDotDashed} page="status" />
        <SideBarButton Icon={LuUsers} page="friends" />
        <SideBarButton Icon={LuUserRoundX} page="blocks" />
      </div>
      <div className="flex-1">
        <Separator />
      </div>
      <div className="flex flex-col">
        <SideBarButton Icon={LuSettings} page="settings" />
        <SideBarButton Icon={LuUser} page="profile" />
      </div>
    </div>
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
