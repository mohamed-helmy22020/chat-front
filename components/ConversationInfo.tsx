import { useChatStore } from "@/store/chatStore";
import GroupInfo from "./GroupInfo";

const ConversationInfo = () => {
  const conversation = useChatStore(
    (state) => state.infoItem,
  ) as ConversationType;
  if (conversation.groupName) {
    return <GroupInfo />;
  }
  return <div>ConversationInfo</div>;
};

export default ConversationInfo;
