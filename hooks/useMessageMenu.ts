import {
  addReaction as addReactionAction,
  deleteMessage as deleteMessageAction,
} from "@/lib/actions/user.actions";
import { REACTS } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import React from "react";
import { toast } from "sonner";

const useMessageMenu = (message: MessageType) => {
  const user = useUserStore((state) => state.user);
  const addReaction = useChatStore((state) => state.addReaction);
  const deleteMessage = useChatStore((state) => state.deleteMessage);

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
      toast.error("Failed to copy message text");
    }
  };
  return {
    handleReact,
    handleDeleteMessage,
    handleCopyMessage,
  };
};

export default useMessageMenu;
