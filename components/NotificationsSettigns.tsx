import useNotifications from "@/hooks/useNotifications";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";

type Props = {
  setCurrentSettings: (value?: string) => void;
};

const NotificationsSettigns = ({ setCurrentSettings }: Props) => {
  const initialized = useRef(false);
  const { getNotificationsPermission } = useNotifications();
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      getNotificationsPermission();
    })();
  }, [getNotificationsPermission, initialized]);

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
        <p>Notifications</p>
      </div>
    </motion.div>
  );
};

export default NotificationsSettigns;
