import { motion } from "motion/react";
import { FaArrowLeft } from "react-icons/fa6";

type Props = {
  setCurrentSettings: (value?: string) => void;
};
const ChatsSettings = ({ setCurrentSettings }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center p-5 select-none">
        <button
          onClick={() => setCurrentSettings(undefined)}
          className="cursor-pointer pe-2"
        >
          <FaArrowLeft className="transition hover:-translate-x-1" />
        </button>
        <p>Chats</p>
      </div>
    </motion.div>
  );
};

export default ChatsSettings;
