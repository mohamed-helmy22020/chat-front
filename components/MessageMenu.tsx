import {
  addReaction as addReactionAction,
  deleteMessage as deleteMessageAction,
} from "@/lib/actions/user.actions";
import { REACTS } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { useState } from "react";
import {
  AiTwotoneDislike as DislikeEmoji,
  AiTwotoneLike as LikeEmoji,
} from "react-icons/ai";
import { BsFillEmojiSurpriseFill as WowEmoji } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { FaAngry as AngryEmoji, FaRegSmile } from "react-icons/fa";
import {
  FaFaceLaughBeam as LaughEmoji,
  FaFaceSadTear as SadEmoji,
} from "react-icons/fa6";
import { FcLike as LoveEmoji } from "react-icons/fc";
import { IoCopy } from "react-icons/io5";
import { MdDeleteForever, MdKeyboardArrowDown } from "react-icons/md";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
type Props = {
  message: MessageType;
};

const MessageMenu = ({ message }: Props) => {
  const user = useUserStore((state) => state.user);
  const addReaction = useChatStore((state) => state.addReaction);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const [isOpen, setIsOpen] = useState(false);
  const userReact = message.reacts.find(
    (react) => react.user._id === user?._id,
  );
  const handleReact = async (e: React.MouseEvent<HTMLDivElement>) => {
    const selectedReact = parseInt(
      (e.target as HTMLDivElement).dataset.react as string,
    );
    if (isNaN(selectedReact)) return;
    const react: ReactType = {
      react: "Like",
      user: {
        _id: user!._id,
        userProfileImage: user!.userProfileImage,
        name: user!.name,
      },
    };
    if (selectedReact === REACTS.like.id) {
      react.react = REACTS.like.name;
    } else if (selectedReact === REACTS.dislike.id) {
      react.react = REACTS.dislike.name;
    } else if (selectedReact === REACTS.love.id) {
      react.react = REACTS.love.name;
    } else if (selectedReact === REACTS.laugh.id) {
      react.react = REACTS.laugh.name;
    } else if (selectedReact === REACTS.wow.id) {
      react.react = REACTS.wow.name;
    } else if (selectedReact === REACTS.sad.id) {
      react.react = REACTS.sad.name;
    } else if (selectedReact === REACTS.angry.id) {
      react.react = REACTS.angry.name;
    }
    addReaction(message.id, user!._id, react);

    try {
      const addReactionRes = await addReactionAction(message.id, react.react);
      if (!addReactionRes.success) {
        throw new Error("Failed to add reaction");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      const deleteMessageRes = await deleteMessageAction(message.id);
      console.log({ deleteMessageRes });
      if (deleteMessageRes.success) {
        deleteMessage(message.id);
        return;
      }
      throw new Error("Failed to delete message");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
    } catch (error) {
      console.log("Failed to copy message text", error);
    }
  };
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghostFull"
          className={clsx(
            "flex w-0 gap-0 overflow-hidden rounded-full bg-site-foreground !p-1.5 opacity-0 peer-hover:w-fit peer-hover:gap-2 peer-hover:opacity-100 hover:w-fit hover:gap-2 hover:opacity-80",
            isOpen && "w-fit gap-2 opacity-80",
          )}
        >
          <FaRegSmile />
          <MdKeyboardArrowDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopyMessage}>
          <IoCopy /> Copy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CiStar /> Star
        </DropdownMenuItem>
        {message.from === user?._id && (
          <DropdownMenuItem onClick={handleDeleteMessage}>
            <MdDeleteForever /> Delete
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <div className="flex" onClick={handleReact}>
          <DropdownMenuItem
            data-react={REACTS.like.id}
            title={REACTS.like.name}
            className={clsx(
              userReact?.react === REACTS.like.name && "bg-accent",
            )}
          >
            <LikeEmoji />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.dislike.id}
            title={REACTS.dislike.name}
            className={clsx(
              userReact?.react === REACTS.dislike.name && "bg-accent",
            )}
          >
            <DislikeEmoji />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.love.id}
            title={REACTS.love.name}
            className={clsx(
              userReact?.react === REACTS.love.name && "bg-accent",
            )}
          >
            <LoveEmoji />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.laugh.id}
            title={REACTS.laugh.name}
            className={clsx(
              userReact?.react === REACTS.laugh.name && "bg-accent",
            )}
          >
            <LaughEmoji color="#ffcc4d" />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.wow.id}
            title={REACTS.wow.name}
            className={clsx(
              userReact?.react === REACTS.wow.name && "bg-accent",
            )}
          >
            <WowEmoji color="#ffcc4d" />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.sad.id}
            title={REACTS.sad.name}
            className={clsx(
              userReact?.react === REACTS.sad.name && "bg-accent",
            )}
          >
            <SadEmoji color="#ffcc4d" />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.angry.id}
            title={REACTS.angry.name}
            className={clsx(
              userReact?.react === REACTS.angry.name && "bg-accent",
            )}
          >
            <AngryEmoji color="#ffcc4d" />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageMenu;
