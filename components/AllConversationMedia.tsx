import { useChatStore } from "@/store/chatStore";
import clsx from "clsx";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  message: MessageType;
};

const AllConversationMedia = (props: Props) => {
  const { currentConversationMessages, changeCurrentSelectedMediaMessage } =
    useChatStore(
      useShallow((state) => ({
        currentConversationMessages: state.currentConversationMessages,
        changeCurrentSelectedMediaMessage:
          state.changeCurrentSelectedMediaMessage,
      })),
    );
  const parentDiv = useRef<HTMLDivElement>(null);
  const MediaElements = currentConversationMessages.map((message) => {
    if (message.mediaType === "image" || message.mediaType === "video") {
      return (
        <div
          key={message.id}
          className={clsx(
            "h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-sm border-[3px] border-site-background p-1 hover:border-gray-600",
            props.message.id === message.id &&
              "!h-14 !w-14 bg-mainColor-600 hover:border-site-background",
          )}
          onClick={() => {
            changeCurrentSelectedMediaMessage(message);
          }}
          data-message-id={message.id}
        >
          <Media url={message.mediaUrl!} type={message.mediaType} />
        </div>
      );
    }
  });
  useLayoutEffect(() => {
    if (parentDiv.current) {
      const currentMessageElement = parentDiv.current.querySelector(
        `[data-message-id='${props.message.id}']`,
      ) as HTMLDivElement;
      if (currentMessageElement) {
        const parentWidth = parentDiv.current.clientWidth;
        const elementOffsetLeft = currentMessageElement.offsetLeft;
        const elementWidth = currentMessageElement.clientWidth;
        const scrollPosition =
          elementOffsetLeft - parentWidth / 2 + elementWidth / 2;
        parentDiv.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [props.message]);

  return (
    <div
      className="flex h-full w-full items-center gap-2 overflow-auto"
      ref={parentDiv}
    >
      <div className="h-full min-w-1/2"></div>
      {MediaElements}
      <div className="h-full min-w-1/2"></div>
    </div>
  );
};

const Media = ({ url, type }: { url: string; type: "image" | "video" }) => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {type === "image" && (
        <Image
          unoptimized
          src={url}
          alt="media"
          fill
          className="object-contain"
        />
      )}
      {type === "video" && (
        <video
          src={url}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          preload="metadata"
        />
      )}
    </div>
  );
};

export default AllConversationMedia;
