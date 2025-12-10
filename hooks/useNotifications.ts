import { toast } from "sonner";

const useNotifications = () => {
  const getNotificationsPermission = async () => {
    if (Notification.permission === "granted") {
      return true;
    }
    if (Notification.permission === "default") {
      return await Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          return true;
        } else {
          toast.error("Notifications permission denied");
          return false;
        }
      });
    }
    return false;
  };
  return { getNotificationsPermission };
};

export default useNotifications;
