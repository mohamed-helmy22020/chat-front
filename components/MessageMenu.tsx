import useMessageMenu from "@/hooks/useMessageMenu";
import { REACTS } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  AiTwotoneDislike as DislikeEmoji,
  AiTwotoneLike as LikeEmoji,
} from "react-icons/ai";
import { BsFillEmojiSurpriseFill as WowEmoji } from "react-icons/bs";
import { CgMailForward } from "react-icons/cg";
import { CiStar } from "react-icons/ci";
import { FaAngry as AngryEmoji, FaRegSmile } from "react-icons/fa";
import {
  FaReply,
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
  const t = useTranslations("Chat.Conversation.MessageMenu");
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const userReact = message.reacts.find(
    (react) => react.user._id === user?._id,
  );
  const {
    handleCopyMessage,
    handleDeleteMessage,
    handleReact,
    handleForwardMessage,
    handleReplyMessage,
  } = useMessageMenu(message);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghostFull"
          className={clsx(
            "hover:bg-gray-400",
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
          <IoCopy /> {t("Copy")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleReplyMessage}>
          <FaReply /> {t("Reply")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CiStar /> {t("Star")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleForwardMessage}>
          <CgMailForward /> {t("Forward")}
        </DropdownMenuItem>

        {message.from._id === user?._id && (
          <DropdownMenuItem onClick={handleDeleteMessage}>
            <MdDeleteForever /> {t("Delete")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <div className="flex" onClick={handleReact}>
          <DropdownMenuItem
            data-react={REACTS.like.id}
            title={REACTS.like.name}
            className={clsx(
              userReact?.react === REACTS.like.name &&
                "!bg-mainColor-600 dark:bg-accent",
            )}
          >
            <LikeEmoji />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.dislike.id}
            title={REACTS.dislike.name}
            className={clsx(
              userReact?.react === REACTS.dislike.name &&
                "!bg-mainColor-600 dark:!bg-accent",
            )}
          >
            <DislikeEmoji />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.love.id}
            title={REACTS.love.name}
            className={clsx(
              userReact?.react === REACTS.love.name &&
                "!bg-mainColor-600 dark:bg-accent",
            )}
          >
            <LoveEmoji />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.laugh.id}
            title={REACTS.laugh.name}
            className={clsx(
              userReact?.react === REACTS.laugh.name &&
                "!bg-mainColor-600 dark:bg-accent",
            )}
          >
            <LaughEmoji color="#ffcc4d" />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.wow.id}
            title={REACTS.wow.name}
            className={clsx(
              userReact?.react === REACTS.wow.name &&
                "!bg-mainColor-600 dark:bg-accent",
            )}
          >
            <WowEmoji color="#ffcc4d" />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.sad.id}
            title={REACTS.sad.name}
            className={clsx(
              userReact?.react === REACTS.sad.name &&
                "!bg-mainColor-600 dark:bg-accent",
            )}
          >
            <SadEmoji color="#ffcc4d" />
          </DropdownMenuItem>
          <DropdownMenuItem
            data-react={REACTS.angry.id}
            title={REACTS.angry.name}
            className={clsx(
              userReact?.react === REACTS.angry.name &&
                "!bg-mainColor-600 dark:bg-accent",
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
