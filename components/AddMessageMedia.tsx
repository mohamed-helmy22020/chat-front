import { allowedPictureTypes, allowedVideoTypes } from "@/lib/utils";
import { chatSocket } from "@/src/socket";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  file: File;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  oldMessageText: string;
  to: string;
};
const AddMessageMedia = ({
  setSelectedFile,
  file,
  oldMessageText,
  to,
}: Props) => {
  const isAllowedImage = allowedPictureTypes.includes(file.type);
  const mediaUrl = useMemo(() => {
    return URL.createObjectURL(file);
  }, [file]);

  const user = useUserStore((state) => state.user);
  const {
    currentConversation,
    addMessage,
    changeLastMessage,
    updateMessage,
    deleteMessage,
  } = useChatStore(
    useShallow((state) => ({
      currentConversation: state.currentConversation,
      addMessage: state.addMessage,
      updateMessage: state.updateMessage,
      changeLastMessage: state.changeLastMessage,
      deleteMessage: state.deleteMessage,
    })),
  );
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState(oldMessageText);

  const sendMessage = () => {
    setIsSending(true);
    const id = Math.random().toString();
    const newMessage: MessageType = {
      id,
      conversationId: currentConversation!.id,
      from: user!._id,
      to: to,
      text: messageText.trim(),
      seen: false,
      mediaUrl: mediaUrl,
      mediaType: isAllowedImage ? "image" : "video",
      reacts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: "pending",
    };
    addMessage(newMessage, currentConversation!);

    changeLastMessage(currentConversation!, newMessage);
    chatSocket.emit(
      "sendPrivateMessage",
      to,
      messageText.trim(),
      {
        buffer: file,
        mimetype: file.type,
      },
      (res: ReceiveMessageType) => {
        setMessageText("");

        if (res.success) {
          updateMessage(id, res.message);
          changeLastMessage(res.conversation, res.message);
        } else {
          deleteMessage(id!);
        }
        setIsSending(false);
        setSelectedFile(null);
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "tween" }}
      className="fixed top-0 left-0 z-50 flex h-svh w-screen flex-col overflow-hidden bg-site-background"
    >
      <div className="flex items-start justify-start px-3 py-3">
        <Button
          className="scale-110 cursor-pointer"
          variant="ghostFull"
          onClick={() => {
            setSelectedFile(null);
          }}
        >
          <X />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center py-5">
        {allowedPictureTypes.includes(file.type) && (
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              unoptimized
              src={mediaUrl}
              alt="message media"
              fill
              className="object-contain"
            />
          </div>
        )}
        {allowedVideoTypes.includes(file.type) && (
          <div className="relative flex h-full max-h-full w-full max-w-full items-center justify-center">
            <video
              src={mediaUrl}
              autoPlay
              className="absolute max-h-full max-w-full object-contain"
              controls
              muted
              controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
              disablePictureInPicture
              disableRemotePlayback
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center pb-10">
        <div className="flex w-xl justify-center">
          <div className="flex-1">
            <Input
              className="w-full rounded-sm border-0 !bg-site-foreground ring-0 placeholder:text-white"
              placeholder="Add a caption"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isSending}
            />
          </div>
          <div>
            <Button
              variant="ghostFull"
              className="cursor-pointer"
              onClick={sendMessage}
              disabled={isSending}
            >
              {isSending ? <Loader2 className="animate-spin" /> : <IoMdSend />}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddMessageMedia;
