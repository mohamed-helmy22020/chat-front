import { useChatStore } from "@/store/chatStore";
import ConversationInfo from "./ConversationInfo";
import MessageInfo from "./MessageInfo";

const InfoMenu = () => {
  const infoItem = useChatStore((state) => state.infoItem)!;
  return (
    <div className="h-full w-full lg:w-1/2 lg:border xl:w-5/12">
      {"participants" in infoItem && <ConversationInfo />}
      {"reacts" in infoItem && <MessageInfo />}
    </div>
  );
};

export default InfoMenu;
