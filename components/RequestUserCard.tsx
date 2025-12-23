import { CgUnblock } from "react-icons/cg";
import { FiPlusCircle } from "react-icons/fi";
import {
  LuBan,
  LuCheck,
  LuEllipsisVertical,
  LuLoader,
  LuMessageSquareMore,
  LuUserRoundMinus,
  LuUserX,
  LuX,
} from "react-icons/lu";

import useAddFriend from "@/hooks/useAddFriend";
import useBlockUser from "@/hooks/useBlockUser";
import useCancelSentRequest from "@/hooks/useCancelSentRequest";
import useChatWith from "@/hooks/useChatWith";
import useForwardMessage from "@/hooks/useForwardMessage";
import useHandleFriendRequest from "@/hooks/useHandleFriendRequest";
import useInviteGroup from "@/hooks/useInviteGroup";
import useRemoveFromGroup from "@/hooks/useRemoveFromGroup";
import useUnBlockUser from "@/hooks/useUnBlockUser";
import useUnFriendUser from "@/hooks/useUnFriendUser";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
type Props = {
  user: RequestUserType;
  type?:
    | "friends"
    | "blocks"
    | "request"
    | "sent"
    | "addFriend"
    | "newChat"
    | "forward"
    | "inviteGroup"
    | "groupMember";
  extra?: {
    isGroupAdmin?: boolean;
  };
};

const RequestUserCard = ({ user, type = "friends", extra }: Props) => {
  const { _id, userProfileImage, name, bio } = user;
  const chatWith = useChatWith();
  const { forwardMessage } = useForwardMessage();
  const { inviteToGroup } = useInviteGroup();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-15 w-full cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 select-none hover:bg-site-foreground"
      role="button"
      onClick={() => {
        if (type === "newChat") chatWith(_id);
        if (type === "forward") forwardMessage(_id);
        if (type === "inviteGroup") inviteToGroup(_id);
      }}
    >
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
        <Image
          className="rounded-full object-cover"
          src={userProfileImage || "/imgs/user.jpg"}
          alt="avatar"
          fill
        />
        {user.isOnline === undefined ||
        extra?.isGroupAdmin ? null : user.isOnline ? (
          <div className="absolute -end-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500"></div>
        ) : (
          <div className="absolute -end-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-red-500"></div>
        )}
        {extra?.isGroupAdmin && (
          <div className="absolute -end-1 -bottom-1">
            <MdAdminPanelSettings />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col items-start justify-center">
        <h1 className="text-md capitalize dark:font-bold">{name}</h1>
        {bio && <p className="line-clamp-1 text-sm text-gray-500">{bio}</p>}
      </div>
      <div className="flex items-center text-gray-900 dark:text-gray-300">
        {(type === "friends" && <FriendsMenu userId={_id} />) ||
          (type === "blocks" && <BlocksMenu userId={_id} />) ||
          (type === "request" && <RequestsMenu userId={_id} />) ||
          (type === "sent" && <SentMenu userId={_id} />) ||
          (type === "addFriend" && <AddFriendMenu userId={_id} />) ||
          (type === "groupMember" && <GroupMemberMenu userId={_id} />)}
      </div>
    </motion.div>
  );
};

const FriendsMenu = ({ userId }: { userId: string }) => {
  const t = useTranslations("RequestUserCard.FriendsMenu");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const blockUser = useBlockUser();
  const chatWith = useChatWith();
  const unFriendUser = useUnFriendUser();

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger>
        <LuEllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Button
            className="w-full justify-start"
            variant="ghostFull"
            onClick={() => chatWith(userId)}
          >
            <LuMessageSquareMore /> {t("chatWith")}
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={() => blockUser(userId)}
            className="w-full justify-start"
            variant="ghostFull"
          >
            <LuBan /> {t("BlockUser")}
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={() => unFriendUser(userId)}
            className="w-full justify-start"
            variant="ghostFull"
          >
            <LuUserRoundMinus /> {t("UnfriendUser")}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const BlocksMenu = ({ userId }: { userId: string }) => {
  const t = useTranslations("RequestUserCard.BlocksMenu");
  const { unblockUser, isUnblocked, isUnblocking } = useUnBlockUser();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghostFull"
          className="cursor-pointer rounded-full p-1 hover:scale-110"
          disabled={isUnblocking || isUnblocked}
          onClick={() => unblockUser(userId)}
        >
          {isUnblocking ? (
            <LuLoader className="animate-spin" />
          ) : isUnblocked ? (
            <LuCheck />
          ) : (
            <CgUnblock />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="rounded-full" sideOffset={-5}>
        <p>
          {isUnblocking
            ? t("Unblocking")
            : isUnblocked
              ? t("Unblocked")
              : t("UnblockUser")}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const RequestsMenu = ({ userId }: { userId: string }) => {
  const t = useTranslations("RequestUserCard.RequestsMenu");
  const { handleFriendRequest, isLoading, isDone } = useHandleFriendRequest();

  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghostFull"
            className="cursor-pointer rounded-full p-1 hover:scale-110"
            disabled={isLoading || isDone}
            onClick={() => handleFriendRequest(userId, "accept-request")}
          >
            {isLoading ? (
              <LuLoader className="animate-spin" />
            ) : isDone ? (
              <LuCheck />
            ) : (
              <LuCheck />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="rounded-full" sideOffset={-5}>
          <p>{t("AcceptFriendRequest")}</p>
        </TooltipContent>
      </Tooltip>
      {!isLoading && !isDone && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghostFull"
              className="cursor-pointer rounded-full p-1 hover:scale-110"
              disabled={isLoading || isDone}
              onClick={() => handleFriendRequest(userId, "cancel-request")}
            >
              {isLoading ? (
                <LuLoader className="animate-spin" />
              ) : isDone ? (
                <LuCheck />
              ) : (
                <LuX />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="rounded-full" sideOffset={-5}>
            <p>{t("CancelFriendRequest")}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

const SentMenu = ({ userId }: { userId: string }) => {
  const t = useTranslations("RequestUserCard.SentMenu");
  const { cancelSentRequest, isCancelling, isCancelled } =
    useCancelSentRequest();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghostFull"
          className="cursor-pointer rounded-full p-1 hover:scale-110"
          disabled={isCancelling || isCancelled}
          onClick={() => cancelSentRequest(userId)}
        >
          {isCancelling ? (
            <LuLoader className="animate-spin" />
          ) : isCancelled ? (
            <LuCheck />
          ) : (
            <LuUserX />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="rounded-full" sideOffset={-5}>
        <p>
          {isCancelling
            ? t("Cancelling")
            : isCancelled
              ? t("Cancelled")
              : t("CancelRequest")}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const AddFriendMenu = ({ userId }: { userId: string }) => {
  const t = useTranslations("RequestUserCard.AddFriendMenu");
  const { addFriend, isSending, isSent } = useAddFriend();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghostFull"
          className="cursor-pointer rounded-full p-1 hover:scale-110"
          disabled={isSending || isSent}
          onClick={() => addFriend(userId)}
        >
          {isSending ? (
            <LuLoader className="animate-spin" />
          ) : isSent ? (
            <LuCheck />
          ) : (
            <FiPlusCircle />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="rounded-full" sideOffset={-5}>
        <p>{isSending ? t("Sending") : isSent ? t("Sent") : t("AddFriend")}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const GroupMemberMenu = ({ userId }: { userId: string }) => {
  const t = useTranslations("RequestUserCard.InviteGroup");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentUserId = useUserStore((state) => state.user?._id);
  const group = useChatStore((state) => state.currentConversation);
  const { removeFromGroup } = useRemoveFromGroup();
  if (
    !group ||
    !group.participants.find((p) => p._id === currentUserId) ||
    userId === currentUserId
  )
    return;
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger>
        <LuEllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Button
            className="w-full justify-start"
            variant="ghostFull"
            onClick={() => removeFromGroup(group.id, userId)}
          >
            <IoIosRemoveCircleOutline /> {t("Remove")}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RequestUserCard;
