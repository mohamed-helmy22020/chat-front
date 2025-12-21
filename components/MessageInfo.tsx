import { useChatStore } from "@/store/chatStore";

const MessageInfo = () => {
  const message = useChatStore((state) => state.infoItem) as MessageType;
  return <div>MessageInfo</div>;
};

export default MessageInfo;
