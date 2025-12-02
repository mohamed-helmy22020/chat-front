import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  deleteFriend,
  getUserConversation,
  sendFriendRequest,
  unblockUser,
} from "@/lib/actions/user.actions";
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

import { useChatStore } from "@/store/chatStore";
import { usePageStore } from "@/store/pageStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
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
  type?: "friends" | "blocks" | "request" | "sent" | "addFriend";
};

const RequestUserCard = ({ user, type = "friends" }: Props) => {
  const { _id, userProfileImage, name, bio } = user;
  return (
    <div className="flex min-h-15 w-full cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 hover:bg-site-foreground">
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
        <h1 className="text-md font-bold capitalize">{name}</h1>
        {bio && <p className="line-clamp-1 text-sm text-gray-500">{bio}</p>}
      </div>
      <div className="flex items-center text-gray-300">
        {(type === "friends" && <FriendsMenu userId={_id} />) ||
          (type === "blocks" && <BlocksMenu userId={_id} />) ||
          (type === "request" && <RequestsMenu userId={_id} />) ||
          (type === "sent" && <SentMenu userId={_id} />) ||
          (type === "addFriend" && <AddFriendMenu user={user} />)}
      </div>
    </div>
  );
};

const FriendsMenu = ({ userId }: { userId: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { changeCurrentConversation, conversations } = useChatStore(
    useShallow((state) => ({
      changeCurrentConversation: state.changeCurrentConversation,
      conversations: state.conversations,
    })),
  );
  const { friendsList, blockedList, setFriendsList, setBlockedList } =
    useUserStore(
      useShallow((state) => ({
        friendsList: state.friendsList,
        blockedList: state.blockedList,
        setFriendsList: state.setFriendsList,
        setBlockedList: state.setBlockedList,
      })),
    );
  const setPage = usePageStore((state) => state.setPage);

  const handleChatWith = async () => {
    const existConversation = conversations.find(
      (c) => c.participants.findIndex((p) => p._id === userId) > -1,
    );
    if (existConversation) {
      changeCurrentConversation(existConversation);
      setPage("chat");
      return;
    }
    try {
      const toastId = toast.loading("Loading conversation...");
      const getUserConversationRes = await getUserConversation(userId);
      toast.dismiss(toastId);
      if (getUserConversationRes.success) {
        changeCurrentConversation(getUserConversationRes.conversation);
        setPage("chat");
      } else {
        throw new Error("Error getting conversation");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error getting conversation");
    }
  };

  const handleUnFriendUser = async () => {
    const unfriendUserRes = deleteFriend(userId);

    toast.promise(unfriendUserRes, {
      loading: "Deleting...",
      success: () => {
        setFriendsList(friendsList.filter((f) => f._id !== userId));
        return {
          message: `User is no longer a friend`,
          closeButton: true,
        };
      },
      error: "Error",
    });
  };
  const handleBlockUser = async () => {
    const blockUserRes = blockUser(userId);

    toast.promise(blockUserRes, {
      loading: "Blocking...",
      success: () => {
        setBlockedList([
          ...blockedList,
          friendsList.find((f) => f._id === userId)!,
        ]);
        setFriendsList(friendsList.filter((f) => f._id !== userId));
        return {
          message: `User is no longer a friend`,
          closeButton: true,
        };
      },
      error: "Error",
    });
  };
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
            onClick={handleChatWith}
          >
            <LuMessageSquareMore /> Chat with
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={handleBlockUser}
            className="w-full justify-start"
            variant="ghostFull"
          >
            <LuBan /> Block user
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={handleUnFriendUser}
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
  const { blockedList, setBlockedList } = useUserStore(
    useShallow((state) => ({
      blockedList: state.blockedList,
      setBlockedList: state.setBlockedList,
    })),
  );
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [isUnblocked, setIsUnblocked] = useState(false);
  const handleUnblockUser = async () => {
    setIsUnblocking(true);
    try {
      await unblockUser(userId);
      setIsUnblocked(true);
      setBlockedList(blockedList.filter((b) => b._id !== userId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsUnblocking(false);
    }
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghostFull"
          className="cursor-pointer rounded-full p-1 hover:scale-110"
          disabled={isUnblocking || isUnblocked}
          onClick={handleUnblockUser}
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
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const {
    friendsList,
    setFriendsList,
    receivedRequestsList,
    setReceivedRequestsList,
  } = useUserStore(
    useShallow((state) => ({
      receivedRequestsList: state.receivedRequestsList,
      friendsList: state.friendsList,
      setReceivedRequestsList: state.setReceivedRequestsList,
      setFriendsList: state.setFriendsList,
    })),
  );
  const handleFriendRequest = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setIsSending(true);
    const id = e.currentTarget.id;
    try {
      if (id === "accept-request") {
        await acceptFriendRequest(userId);
        setFriendsList([
          ...friendsList,
          receivedRequestsList.find((r) => r._id === userId)!,
        ]);
        setReceivedRequestsList(
          receivedRequestsList.filter((r) => r._id !== userId),
        );
      } else {
        await cancelFriendRequest(userId);
        setReceivedRequestsList(
          receivedRequestsList.filter((r) => r._id !== userId),
        );
      }
      setIsSent(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghostFull"
            className="cursor-pointer rounded-full p-1 hover:scale-110"
            disabled={isSending || isSent}
            id="accept-request"
            onClick={handleFriendRequest}
          >
            {isSending ? (
              <LuLoader className="animate-spin" />
            ) : isSent ? (
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
      {!isSending && !isSent && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghostFull"
              className="cursor-pointer rounded-full p-1 hover:scale-110"
              disabled={isSending || isSent}
              id="cancel-request"
              onClick={handleFriendRequest}
            >
              {isSending ? (
                <LuLoader className="animate-spin" />
              ) : isSent ? (
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
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const { sentRequestsList, setSentRequestsList } = useUserStore(
    useShallow((state) => ({
      sentRequestsList: state.sentRequestsList,
      setSentRequestsList: state.setSentRequestsList,
    })),
  );
  const handleAddingFriend = async () => {
    setIsCancelling(true);
    try {
      await cancelFriendRequest(userId);
      setIsCancelled(true);
      setSentRequestsList(sentRequestsList.filter((r) => r._id !== userId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsCancelling(false);
    }
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghostFull"
          className="cursor-pointer rounded-full p-1 hover:scale-110"
          disabled={isCancelling || isCancelled}
          onClick={handleAddingFriend}
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

const AddFriendMenu = ({ user }: { user: RequestUserType }) => {
  const { _id: userId } = user;
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { sentRequestsList, setSentRequestsList } = useUserStore(
    useShallow((state) => ({
      setSentRequestsList: state.setSentRequestsList,
      sentRequestsList: state.sentRequestsList,
    })),
  );
  const handleAddingFriend = async () => {
    setIsSending(true);
    try {
      const sendFriendRequestRes = await sendFriendRequest(userId);
      if (sendFriendRequestRes.success) {
        setIsSent(true);
        setSentRequestsList([...sentRequestsList, user]);
      } else {
        throw new Error(sendFriendRequestRes.msg);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghostFull"
          className="cursor-pointer rounded-full p-1 hover:scale-110"
          disabled={isSending || isSent}
          onClick={handleAddingFriend}
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
