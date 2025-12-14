import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import useMessageMenu from "@/hooks/useMessageMenu";
import { REACTS } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React from "react";
import {
  AiTwotoneDislike as DislikeEmoji,
  AiTwotoneLike as LikeEmoji,
} from "react-icons/ai";
import { BsFillEmojiSurpriseFill as WowEmoji } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { FaAngry as AngryEmoji } from "react-icons/fa";
import {
  FaFaceLaughBeam as LaughEmoji,
  FaFaceSadTear as SadEmoji,
} from "react-icons/fa6";
import { FcLike as LoveEmoji } from "react-icons/fc";
import { IoCopy } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";
type Props = {
  message: MessageType;
  children: React.ReactNode;
};

const MessageContextMenu = ({ children, message }: Props) => {
  const t = useTranslations("Chat.Conversation.MessageMenu");
  const user = useUserStore((state) => state.user);
  const userReact = message.reacts.find(
    (react) => react.user._id === user?._id,
  );
  const { handleCopyMessage, handleDeleteMessage, handleReact } =
    useMessageMenu(message);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopyMessage}>
          <IoCopy /> {t("Copy")}
        </ContextMenuItem>
        <DropdownMenuSeparator />
        <ContextMenuItem>
          <CiStar /> {t("Star")}
        </ContextMenuItem>
        {message.from === user?._id && (
          <ContextMenuItem onClick={handleDeleteMessage}>
            <MdDeleteForever /> {t("Delete")}
          </ContextMenuItem>
        )}
        <DropdownMenuSeparator />
        <div className="flex" onClick={handleReact}>
          <ContextMenuItem
            data-react={REACTS.like.id}
            title={REACTS.like.name}
            className={clsx(
              userReact?.react === REACTS.like.name && "bg-accent",
            )}
          >
            <LikeEmoji />
          </ContextMenuItem>
          <ContextMenuItem
            data-react={REACTS.dislike.id}
            title={REACTS.dislike.name}
            className={clsx(
              userReact?.react === REACTS.dislike.name && "bg-accent",
            )}
          >
            <DislikeEmoji />
          </ContextMenuItem>
          <ContextMenuItem
            data-react={REACTS.love.id}
            title={REACTS.love.name}
            className={clsx(
              userReact?.react === REACTS.love.name && "bg-accent",
            )}
          >
            <LoveEmoji />
          </ContextMenuItem>
          <ContextMenuItem
            data-react={REACTS.laugh.id}
            title={REACTS.laugh.name}
            className={clsx(
              userReact?.react === REACTS.laugh.name && "bg-accent",
            )}
          >
            <LaughEmoji color="#ffcc4d" />
          </ContextMenuItem>
          <ContextMenuItem
            data-react={REACTS.wow.id}
            title={REACTS.wow.name}
            className={clsx(
              userReact?.react === REACTS.wow.name && "bg-accent",
            )}
          >
            <WowEmoji color="#ffcc4d" />
          </ContextMenuItem>
          <ContextMenuItem
            data-react={REACTS.sad.id}
            title={REACTS.sad.name}
            className={clsx(
              userReact?.react === REACTS.sad.name && "bg-accent",
            )}
          >
            <SadEmoji color="#ffcc4d" />
          </ContextMenuItem>
          <ContextMenuItem
            data-react={REACTS.angry.id}
            title={REACTS.angry.name}
            className={clsx(
              userReact?.react === REACTS.angry.name && "bg-accent",
            )}
          >
            <AngryEmoji color="#ffcc4d" />
          </ContextMenuItem>
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageContextMenu;
