import { useChatStore } from "@/store/chatStore";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { getLangDir } from "rtl-detect";
import ConversationInfo from "./ConversationInfo";
import MessageInfo from "./MessageInfo";

const InfoMenu = () => {
  const infoItem = useChatStore((state) => state.infoItem)!;
  const locale = useLocale();
  const dir = getLangDir(locale);
  return (
    <motion.div
      initial={dir === "ltr" ? { opacity: 0, x: 200 } : { opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
      className="h-full w-full lg:w-1/2 lg:border xl:w-5/12"
    >
      {"participants" in infoItem && <ConversationInfo />}
      {"reacts" in infoItem && <MessageInfo />}
    </motion.div>
  );
};

export default InfoMenu;
