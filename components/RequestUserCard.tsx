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
import useHandleFriendRequest from "@/hooks/useHandleFriendRequest";
import useUnBlockUser from "@/hooks/useUnBlockUser";
import useUnFriendUser from "@/hooks/useUnFriendUser";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
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
  type?: "friends" | "blocks" | "request" | "sent" | "addFriend" | "newChat";
};

const RequestUserCard = ({ user, type = "friends" }: Props) => {
  const { _id, userProfileImage, name, bio } = user;
  const chatWith = useChatWith();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-15 w-full cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 select-none hover:bg-site-foreground"
      role="button"
      onClick={() => {
        if (type === "newChat") chatWith(_id);
      }}
    >
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
        <Image
          className="rounded-full object-cover"
          src={userProfileImage || "/imgs/user.jpg"}
          alt="avatar"
          fill
        />
        {user.isOnline === undefined ? null : user.isOnline ? (
          <div className="absolute -end-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500"></div>
        ) : (
          <div className="absolute -end-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-red-500"></div>
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
          (type === "newChat" && null)}
      </div>
    </motion.div>
  );
};

const FriendsMenu = ({ userId }: { userId: string }) => {
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
            <LuMessageSquareMore /> Chat with
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={() => blockUser(userId)}
            className="w-full justify-start"
            variant="ghostFull"
          >
            <LuBan /> Block user
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={() => unFriendUser(userId)}
            className="w-full justify-start"
            variant="ghostFull"
          >
            <LuUserRoundMinus /> Unfriend user
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const BlocksMenu = ({ userId }: { userId: string }) => {
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
            ? "Unblocking..."
            : isUnblocked
              ? "Unblocked"
              : "Unblock user"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const RequestsMenu = ({ userId }: { userId: string }) => {
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
          <p>Accept friend request</p>
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
            <p>Cancel friend request</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

const SentMenu = ({ userId }: { userId: string }) => {
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
            ? "Cancelling..."
            : isCancelled
              ? "Cancelled"
              : "Cancel Request"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const AddFriendMenu = ({ userId }: { userId: string }) => {
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
        <p>{isSending ? "Sending..." : isSent ? "Sent" : "Add Friend"}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RequestUserCard;
