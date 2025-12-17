import { isMobileDevice, REACTS } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import clsx from "clsx";
import Linkify from "linkify-react";
import { motion } from "motion/react";
import Image from "next/image";
import { memo, useState } from "react";
import {
  AiTwotoneDislike as DislikeEmoji,
  AiTwotoneLike as LikeEmoji,
} from "react-icons/ai";
import { BsFillEmojiSurpriseFill as WowEmoji } from "react-icons/bs";
import { FaAngry as AngryEmoji, FaPlay } from "react-icons/fa";
import {
  FaImage,
  FaVideo,
  FaFaceLaughBeam as LaughEmoji,
  FaFaceSadTear as SadEmoji,
} from "react-icons/fa6";
import { FcLike as LoveEmoji } from "react-icons/fc";
import { RiCheckDoubleFill, RiLoader5Fill } from "react-icons/ri";
import MessageContextMenu from "./MessageContextMenu";
import MessageDateSeparator from "./MessageDateSeparator";
import MessageMenu from "./MessageMenu";
import { Button } from "./ui/button";

type Props = {
  message: MessageType;
  isMine: boolean;
  isFirstMessage: boolean;
  otherSide: participant;
  isNewDay: boolean;
};
const ConversationMessage = ({
  message,
  isMine,
  isFirstMessage,
  otherSide,
  isNewDay,
}: Props) => {
  const isMobile = isMobileDevice();
  const reactsElements: React.JSX.Element[] = [];
  const changeReplyMessage = useChatStore((state) => state.changeReplyMessage);
  [...message.reacts]
    .sort(
      (a, b) =>
        REACTS[a.react.toLowerCase()].id - REACTS[b.react.toLowerCase()].id,
    )
    .forEach((react, i, arr) => {
      if (i !== 0 && arr[i - 1].react === react.react) {
        return;
      }
      if (react.react === REACTS.like.name) {
        reactsElements.push(<LikeEmoji key={react.react} />);
      } else if (react.react === REACTS.dislike.name) {
        reactsElements.push(<DislikeEmoji key={react.react} />);
      } else if (react.react === REACTS.love.name) {
        reactsElements.push(<LoveEmoji key={react.react} />);
      } else if (react.react === REACTS.laugh.name) {
        reactsElements.push(<LaughEmoji key={react.react} color="#ffcc4d" />);
      } else if (react.react === REACTS.wow.name) {
        reactsElements.push(<WowEmoji key={react.react} color="#ffcc4d" />);
      } else if (react.react === REACTS.sad.name) {
        reactsElements.push(<SadEmoji key={react.react} color="#ffcc4d" />);
      } else if (react.react === REACTS.angry.name) {
        reactsElements.push(<AngryEmoji key={react.react} color="#ffcc4d" />);
      }
    });

  const TextLinkify = () => (
    <Linkify
      options={{
        defaultProtocol: "https",
        target: "_blank",
        rel: "noopener noreferrer",
      }}
    >
      {message.text}
    </Linkify>
  );
  if (isMine) {
    return (
      <>
        {isNewDay && <MessageDateSeparator date={message.createdAt} />}
        <MessageContextMenu message={message}>
          <div
            onDoubleClick={(e) => {
              e.preventDefault();
              changeReplyMessage(message);
            }}
            className={clsx(
              "message mb-[1px] flex flex-row-reverse items-center justify-start break-words break-all",
              isFirstMessage && "mt-3",
            )}
          >
            <motion.div
              initial={
                message.type === "pending"
                  ? { opacity: 0, x: 100 }
                  : { opacity: 1, x: 0 }
              }
              animate={{ opacity: 1, x: 0 }}
              className={clsx(
                "peer relative max-w-4/5 ps-1",
                message.reacts && message.reacts.length > 0 && "mb-[22px]",
                message.mediaUrl && "max-w-[240px]",
              )}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              <div className="self rounded-sm bg-mainColor-900 px-2 py-2 text-white shadow-sm">
                {message.replyMessage && (
                  <MessageReply
                    replyMessage={message.replyMessage}
                    otherSide={otherSide}
                  />
                )}
                {message.mediaType === "image" && message.mediaUrl && (
                  <MessageImg message={message} />
                )}
                {message.mediaType === "video" && message.mediaUrl && (
                  <MessageVid message={message} />
                )}
                <pre className="text-sm">
                  <TextLinkify />
                </pre>
                <div className="mt-1 mr-1 flex items-center justify-between gap-2 text-right text-sm">
                  <p className="scale-125 text-slate-200">
                    {message.type === "pending" ? (
                      <RiLoader5Fill className="animate-spin" />
                    ) : (
                      <RiCheckDoubleFill
                        color={`${message.seen ? "#0284c7" : "#fff"}`}
                      />
                    )}
                  </p>
                  <p className="text-gray-300 dark:text-slate-400">
                    {new Date(message.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
              {message.reacts && message.reacts.length > 0 && (
                <div className="absolute end-2 bottom-1 z-10 flex translate-y-full items-center justify-center gap-1 rounded-full bg-site-foreground px-2 py-1 text-sm select-none">
                  <div className="flex gap-0.5">{reactsElements}</div>
                  {message.reacts.length}
                </div>
              )}
            </motion.div>
            {!isMobile && <MessageMenu message={message} />}
          </div>
        </MessageContextMenu>
      </>
    );
  }
  return (
    <>
      {isNewDay && <MessageDateSeparator date={message.createdAt} />}
      <MessageContextMenu message={message}>
        <div
          className={clsx(
            "message mb-[1px] flex items-center break-words break-all",
            isFirstMessage && "mt-3",
          )}
          onDoubleClick={(e) => {
            e.preventDefault();
            changeReplyMessage(message);
          }}
        >
          {isFirstMessage ? (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full items-start self-stretch"
            >
              <div className="relative flex h-10 w-10 rounded-full border-2 border-white dark:border-slate-800">
                <Image
                  className="rounded-full object-cover"
                  src={otherSide.userProfileImage || "/imgs/user.jpg"}
                  alt="avatar"
                  fill
                />
              </div>
            </motion.div>
          ) : (
            <div className="h-10 w-10 flex-shrink-0"></div>
          )}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className={clsx(
              "peer relative ms-2 max-w-4/5 pe-1",
              message.reacts && message.reacts.length > 0 && "mb-[22px]",
              message.mediaUrl && "max-w-[240px]",
            )}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-sm bg-site-foreground px-2 py-2 shadow-sm dark:bg-slate-600">
              {message.replyMessage && (
                <MessageReply
                  replyMessage={message.replyMessage}
                  otherSide={otherSide}
                />
              )}
              {message.mediaType === "image" && message.mediaUrl && (
                <MessageImg message={message} />
              )}
              {message.mediaType === "video" && message.mediaUrl && (
                <MessageVid message={message} />
              )}
              <div className="mt-1 ml-1 flex items-end justify-between gap-2 text-xs">
                <pre className="text-sm">
                  <Linkify>{message.text}</Linkify>
                </pre>
              </div>
              <div className="mt-1 mr-1 flex items-center justify-between gap-2 text-right text-sm">
                <p></p>
                <p className="text-slate-500 dark:text-slate-400">
                  {new Date(message.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
            {message.reacts && message.reacts.length > 0 && (
              <div className="absolute start-2 bottom-1 z-10 flex translate-y-full items-center justify-center gap-1 rounded-full bg-site-foreground px-2 py-1 text-xs select-none">
                <div className="flex gap-0.5">{reactsElements}</div>
                {message.reacts.length}
              </div>
            )}
          </motion.div>
          <MessageMenu message={message} />
        </div>
      </MessageContextMenu>
    </>
  );
};

const MessageReply = memo(
  ({
    replyMessage,
    otherSide,
  }: {
    replyMessage: ReplyMessage;
    otherSide: participant;
  }) => {
    return (
      <div className="relative mb-1 flex h-16 min-w-48 items-center gap-1 overflow-hidden rounded-sm ps-3 select-none">
        <div className="absolute start-0 top-0 h-full w-1 bg-mainColor-600"></div>
        <div className="flex h-full w-2/3 flex-col justify-between py-2">
          <p className="text-md truncate font-bold text-mainColor-500">
            {otherSide._id === replyMessage.from ? otherSide.name : "You"}
          </p>
          <p className="flex items-center gap-2 truncate text-sm text-slate-500 dark:text-slate-400">
            {replyMessage.mediaType === "image" ? (
              <FaImage size={15} />
            ) : replyMessage.mediaType === "video" ? (
              <FaVideo size={15} />
            ) : null}
            {replyMessage.text ? replyMessage.text : replyMessage.mediaType}
          </p>
        </div>
        {replyMessage.mediaType === "image" && replyMessage.mediaUrl && (
          <div className="relative flex h-16 w-1/3 items-center justify-center">
            <Image
              src={replyMessage.mediaUrl}
              fill
              objectFit="cover"
              alt="fs"
            />
          </div>
        )}
        {replyMessage.mediaType === "video" && replyMessage.mediaUrl && (
          <div className="relative flex h-16 w-1/3 items-center justify-center">
            <video
              src={replyMessage.mediaUrl}
              className="absolute object-cover"
              muted
              autoPlay={false}
              controlsList="nodownload"
              preload="metadata"
            />
          </div>
        )}
      </div>
    );
  },
);
MessageReply.displayName = "MessageReply";

const MessageImg = memo(({ message }: { message: MessageType }) => {
  const changeCurrentSelectedMediaMessage = useChatStore(
    (state) => state.changeCurrentSelectedMediaMessage,
  );
  return (
    <Button
      variant="ghostFull"
      className="!max-h-80 !max-w-60 cursor-pointer overflow-hidden !p-0"
      onClick={() => changeCurrentSelectedMediaMessage(message)}
    >
      <div className="relative flex max-h-full w-full items-center justify-center">
        <Image src={message.mediaUrl!} width={240} height={320} alt="fs" />
      </div>
    </Button>
  );
});
MessageImg.displayName = "MessageImg";

const MessageVid = memo(({ message }: { message: MessageType }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const changeCurrentSelectedMediaMessage = useChatStore(
    (state) => state.changeCurrentSelectedMediaMessage,
  );
  return (
    <Button
      variant="ghostFull"
      className="!max-h-80 !max-w-60 cursor-pointer overflow-hidden !p-0"
      onClick={() => changeCurrentSelectedMediaMessage(message)}
    >
      <div
        className={clsx(
          "relative flex max-h-80 w-full items-center justify-center",
          !isLoaded && "h-80 w-full",
        )}
      >
        <video
          src={message.mediaUrl}
          className="max-h-full max-w-full"
          muted
          autoPlay={false}
          controlsList="nodownload"
          preload="metadata"
          onLoadedMetadata={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <div className="flex items-center justify-center rounded-full p-2">
            <FaPlay />
          </div>
        </div>
      </div>
    </Button>
  );
});
MessageVid.displayName = "MessageVid";

export default ConversationMessage;
