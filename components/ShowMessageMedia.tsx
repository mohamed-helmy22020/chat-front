import { formatDateToStatus } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import Image from "next/image";
import { FaRegSmile } from "react-icons/fa";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";

const ShowMessageMedia = () => {
  const {
    currentSelectedMediaMessage: {
      message: { createdAt, text, mediaType, mediaUrl },
      user: { name, userProfileImage },
    },
    changeCurrentSelectedMediaMessage,
  } = useChatStore(
    useShallow((state) => ({
      currentSelectedMediaMessage: state.currentSelectedMediaMessage!,
      changeCurrentSelectedMediaMessage:
        state.changeCurrentSelectedMediaMessage,
    })),
  );
  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen flex-col bg-site-background select-none">
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
        className="flex flex-1 flex-col"
        onClick={() => changeCurrentSelectedMediaMessage(null)}
      >
        <div className="flex flex-1 items-center justify-center py-5">
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
                muted
                controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
                disablePictureInPicture
                disableRemotePlayback
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center p-2">{text}</div>
      </div>
      <div className="h-24 border-t"></div>
    </div>
  );
};

export default ShowMessageMedia;
