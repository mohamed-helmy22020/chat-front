import { formatDateToStatus } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import clsx from "clsx";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Image from "next/image";
import { FaRegSmile } from "react-icons/fa";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { useShallow } from "zustand/react/shallow";
import AllConversationMedia from "./AllConversationMedia";
import { Button } from "./ui/button";

const ShowMessageMedia = () => {
  const {
    currentSelectedMediaMessage,
    changeCurrentSelectedMediaMessage,
    currentConversationMessages,
  } = useChatStore(
    useShallow((state) => ({
      currentSelectedMediaMessage: state.currentSelectedMediaMessage!,
      changeCurrentSelectedMediaMessage:
        state.changeCurrentSelectedMediaMessage,
      currentConversationMessages: state.currentConversationMessages,
    })),
  );

  const {
    message: { createdAt, text, mediaType, mediaUrl },
    user: { name, userProfileImage },
  } = currentSelectedMediaMessage;
  const messagesWithMedia = currentConversationMessages.filter(
    (message) => !!message.mediaUrl,
  );

  const currentSelectedMediaMessageIndex = messagesWithMedia.findIndex(
    (message) => message.id === currentSelectedMediaMessage?.message.id,
  );
  const nextMedia = () => {
    if (currentSelectedMediaMessageIndex < messagesWithMedia.length - 1) {
      changeCurrentSelectedMediaMessage(
        messagesWithMedia[currentSelectedMediaMessageIndex + 1],
      );
    }
  };
  const prevMedia = () => {
    if (currentSelectedMediaMessageIndex > 0) {
      changeCurrentSelectedMediaMessage(
        messagesWithMedia[currentSelectedMediaMessageIndex - 1],
      );
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex h-svh w-screen flex-col bg-site-background select-none">
      <div className="flex h-16 justify-between px-5 py-2">
        <div className="flex h-full items-center justify-center">
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
            {
              <p className="line-clamp-1 text-sm text-gray-500">
                {formatDateToStatus(createdAt)}
              </p>
            }
          </div>
        </div>
        <div className="flex h-full items-center justify-center gap-3">
          <Button
            variant="ghostFull"
            className="scale-110 cursor-pointer rounded-full !p-2 hover:bg-site-foreground"
          >
            <FaRegSmile />
          </Button>
          <Button
            variant="ghostFull"
            className="scale-110 cursor-pointer rounded-full !p-2 hover:bg-site-foreground"
          >
            <IoMdDownload />
          </Button>
          <Button
            variant="ghostFull"
            className="scale-110 cursor-pointer rounded-full !p-2 hover:bg-site-foreground"
            onClick={() => changeCurrentSelectedMediaMessage(null)}
          >
            <IoMdClose />
          </Button>
        </div>
      </div>
      <div
        className="relative flex flex-1 flex-col"
        onClick={() => changeCurrentSelectedMediaMessage(null)}
      >
        <Button
          variant="ghostFull"
          className={clsx(
            "absolute top-1/2 left-5 z-20 -translate-y-1/2 scale-125 cursor-pointer rounded-full bg-site-foreground !p-2 hover:opacity-70",
            currentSelectedMediaMessageIndex === 0 && "hidden",
          )}
          onClick={(e) => {
            e.stopPropagation();
            prevMedia();
          }}
        >
          <ArrowBigLeft />
        </Button>
        <Button
          variant="ghostFull"
          className={clsx(
            "absolute top-1/2 right-5 z-20 -translate-y-1/2 scale-125 cursor-pointer rounded-full bg-site-foreground !p-2 hover:opacity-70",
            currentSelectedMediaMessageIndex === messagesWithMedia.length - 1 &&
              "hidden",
          )}
          onClick={(e) => {
            e.stopPropagation();
            nextMedia();
          }}
        >
          <ArrowBigRight />
        </Button>
        <div className="relative flex flex-1 items-center justify-center py-5">
          {mediaType === "image" && (
            <div className="relative flex h-full w-full items-center justify-center">
              <Image
                unoptimized
                src={mediaUrl!}
                alt="status"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          {mediaType === "video" && (
            <div className="relative flex h-full max-h-full w-full max-w-full items-center justify-center">
              <video
                src={mediaUrl}
                autoPlay
                className="absolute max-h-full max-w-full object-cover"
                controls
                controlsList="nofullscreen nodownload noremoteplayback noplaybackrate speed"
                disablePictureInPicture
                disableRemotePlayback
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center p-2">
          <div className="line-clamp-4 max-w-1/2 overflow-hidden">{text}</div>
        </div>
      </div>
      <div className="h-24 w-screen border-t pt-1">
        <AllConversationMedia message={currentSelectedMediaMessage.message} />
      </div>
    </div>
  );
};

export default ShowMessageMedia;
