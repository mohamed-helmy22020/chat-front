import {
  allowedPictureTypes,
  allowedVideoTypes,
  isMobileDevice,
  MAX_PHOTO_SIZE,
  MAX_VIDEO_SIZE,
} from "@/lib/utils";
import { chatSocket } from "@/src/socket";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { useLocalStorage } from "@uidotdev/usehooks";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaImage, FaVideo } from "react-icons/fa6";
import { LuPaperclip, LuSend, LuSmile } from "react-icons/lu";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import AddMessageMedia from "./AddMessageMedia";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const ConversationFooter = () => {
  const t = useTranslations("Chat.Conversation");
  const [enterSend] = useLocalStorage("enterSend", "Enable");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const oldMessage = useRef("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isMobile = isMobileDevice();
  const { theme } = useTheme();
  const {
    currentConversation,
    addMessage,
    updateMessage,
    changeLastMessage,
    deleteMessage,
    replyMessage,
    changeReplyMessage,
  } = useChatStore(
    useShallow((state) => ({
      currentConversation: state.currentConversation,
      addMessage: state.addMessage,
      updateMessage: state.updateMessage,
      changeLastMessage: state.changeLastMessage,
      deleteMessage: state.deleteMessage,
      replyMessage: state.replyMessage,
      changeReplyMessage: state.changeReplyMessage,
    })),
  );
  const otherSide = currentConversation?.participants.find(
    (p) => p._id !== user?._id,
  );
  const to = otherSide?._id as string;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        pickerRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsEmojiPickerOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (
        (e.shiftKey && enterSend === "Disable") ||
        (!e.shiftKey && enterSend === "Enable")
      ) {
        e.preventDefault();
        sendMessage();
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const { type, size } = file;
    const isAllowedImage = allowedPictureTypes.includes(type);
    const isAllowedVideo = allowedVideoTypes.includes(type);

    if (!isAllowedImage && !isAllowedVideo) {
      toast.error(t("InvalidFileType"));
      return;
    }

    if (isAllowedImage && size > MAX_PHOTO_SIZE) {
      toast.error(t("MaxPhotoSizeError"));
      return;
    }

    if (isAllowedVideo && size > MAX_VIDEO_SIZE) {
      toast.error(t("MaxVideoSizeError"));
      return;
    }

    setSelectedFile(file);
    oldMessage.current = messageText;
    setMessageText("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const sendMessage = () => {
    textAreaRef.current?.focus();
    if (messageText.trim() === "") return;
    const id = Math.random().toString();
    const newMessage: MessageType = {
      id,
      conversationId: currentConversation!.id,
      from: user!._id,
      to: to,
      text: messageText.trim(),
      seen: false,
      reacts: [],
      replyMessage: replyMessage!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: "pending",
    };
    setMessageText("");
    setIsTyping(false);
    addMessage(newMessage, currentConversation!);

    changeLastMessage(currentConversation!, newMessage);
    changeReplyMessage(null);
    chatSocket.emit(
      "sendPrivateMessage",
      { to, text: messageText.trim(), replyMessage: replyMessage?.id },
      (res: ReceiveMessageType) => {
        if (res.success) {
          updateMessage(id, res.message);
          changeLastMessage(res.conversation, res.message);
        } else {
          deleteMessage(newMessage.id);
        }
      },
    );
  };
  const handleOnEmojiClick: MouseDownEvent = (...data) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const emoji = data[0].emoji;
    setMessageText((prev) => prev + emoji);
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentValue = textarea.value;

    const newValue =
      currentValue.slice(0, startPos) + emoji + currentValue.slice(endPos);

    setMessageText(newValue);

    // Move cursor to just after the inserted emoji
    setTimeout(() => {
      const newCursorPos = startPos + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };
  return (
    <>
      {selectedFile && (
        <AddMessageMedia
          file={selectedFile}
          setSelectedFile={setSelectedFile}
          oldMessageText={oldMessage.current}
          to={to}
        />
      )}
      <div className="border-t border-slate-200 bg-site-foreground p-3 dark:border-slate-700">
        {replyMessage && (
          <MessageReply replyMessage={replyMessage} otherSide={otherSide!} />
        )}
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={[...allowedPictureTypes, ...allowedVideoTypes].join(",")}
          />
          <button
            className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <LuPaperclip className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>
          {!isMobile && (
            <button
              ref={buttonRef}
              className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={(e) => {
                e.stopPropagation();

                setIsEmojiPickerOpen((prev) => !prev);
              }}
            >
              <LuSmile className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
          )}
          {isEmojiPickerOpen && !isMobile && (
            <div className="absolute bottom-16 left-0 z-10" ref={pickerRef}>
              <EmojiPicker
                onEmojiClick={handleOnEmojiClick}
                theme={theme as Theme}
                skinTonesDisabled={true}
                hiddenEmojis={["1fac3", "1fac4"]}
              />
            </div>
          )}

          <Textarea
            className="no-scrollbar mx-2 max-h-[80px] min-h-6 flex-1 resize-none bg-site-background px-4 py-2 focus:outline-none focus-visible:ring-0"
            placeholder={t("TypeMessage")}
            name="message"
            onChange={(e) => {
              setMessageText(e.target.value);
              if (e.target.value.trim() === "") {
                chatSocket.emit("typing", to, false);
                setIsTyping(false);
              } else if (!isTyping) {
                chatSocket.emit("typing", to, true);
                setIsTyping(true);
              }
            }}
            onKeyDown={handleKeyDown}
            value={messageText}
            ref={textAreaRef}
          />
          <Button
            className="cursor-pointer rounded-full bg-mainColor-600 p-2 text-white hover:bg-mainColor-700"
            onClick={sendMessage}
            variant="ghostFull"
          >
            <LuSend className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

const MessageReply = memo(
  ({
    replyMessage,
    otherSide,
  }: {
    replyMessage: MessageType;
    otherSide: participant;
  }) => {
    const { changeReplyMessage } = useChatStore(
      useShallow((state) => ({
        changeReplyMessage: state.changeReplyMessage,
      })),
    );
    return (
      <div className="relative z-40 mb-1 flex h-16 w-full items-center gap-1 overflow-hidden rounded-sm bg-site-background ps-3 select-none">
        <div className="absolute start-0 top-0 h-full w-1 bg-mainColor-600"></div>
        <div className="flex h-full flex-1 flex-col justify-between py-2">
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
          <div className="relative flex h-16 w-1/3 max-w-16 items-center justify-center">
            <Image
              src={replyMessage.mediaUrl}
              fill
              objectFit="cover"
              alt="fs"
            />
          </div>
        )}
        {replyMessage.mediaType === "video" && replyMessage.mediaUrl && (
          <div className="relative flex h-16 w-1/3 max-w-16 items-center justify-center">
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
        <div className="flex h-full items-start justify-center">
          <Button
            variant="ghostFull"
            className="cursor-pointer !p-1"
            onClick={() => changeReplyMessage(null)}
          >
            <CgClose />
          </Button>
        </div>
      </div>
    );
  },
);
MessageReply.displayName = "MessageReply";

export default ConversationFooter;
