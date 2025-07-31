import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  deleteFriend,
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

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
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

const RequestUserCard = ({
  user: { _id, userProfileImage, name, bio },
  type = "friends",
}: Props) => {
  return (
    <div className="flex min-h-15 w-full cursor-pointer rounded-md px-3 py-1.5 hover:bg-site-foreground">
      <div className="me-2 flex items-center">
        <Image
          className="rounded-full object-cover"
          src={userProfileImage || "/imgs/user.jpg"}
          alt="avatar"
          width={25}
          height={25}
        />
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
          (type === "addFriend" && <AddFriendMenu userId={_id} />)}
      </div>
    </div>
  );
};

const FriendsMenu = ({ userId }: { userId: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleUnFriendUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const unfriendUserRes = deleteFriend(userId);

    toast.promise(unfriendUserRes, {
      loading: "Deleting...",
      success: (data: any) => {
        console.log({ data });

        return {
          message: `User is no longer a friend`,
          closeButton: true,
        };
      },
      error: "Error",
    });
  };
  const handleBlockUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const blockUserRes = blockUser(userId);

    toast.promise(blockUserRes, {
      loading: "Blocking...",
      success: (data: any) => {
        console.log({ data });
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
          <Button className="w-full justify-start" variant="ghostFull">
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
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [isUnblocked, setIsUnblocked] = useState(false);
  const handleUnblockUser = async () => {
    setIsUnblocking(true);
    try {
      const unblockRes = await unblockUser(userId);
      console.log(unblockRes);
      setIsUnblocked(true);
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

  const handleFriendRequest = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setIsSending(true);
    const id = e.currentTarget.id;
    try {
      let friendRequestRes;
      if (id === "accept-request") {
        friendRequestRes = await acceptFriendRequest(userId);
      } else {
        friendRequestRes = await cancelFriendRequest(userId);
      }
      console.log(friendRequestRes);
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
  const handleAddingFriend = async () => {
    setIsCancelling(true);
    try {
      const sendReqRes = await cancelFriendRequest(userId);
      console.log(sendReqRes);
      setIsCancelled(true);
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

const AddFriendMenu = ({ userId }: { userId: string }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const handleAddingFriend = async () => {
    setIsSending(true);
    try {
      const sendReqRes = await sendFriendRequest(userId);
      console.log(sendReqRes);
      setIsSent(true);
    } catch (error) {
      console.log(error);
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
