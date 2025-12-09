import { logOut as logoutAction } from "@/lib/actions/user.actions";
import { chatSocket } from "@/src/socket";
import { useCallStore } from "@/store/callStore";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const resetCall = useCallStore((state) => state.resetCall);
  const resetChats = useChatStore((state) => state.resetChats);
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const resetStatus = useStatusStore((state) => state.resetStatus);
  const resetUser = useUserStore((state) => state.logout);
  const router = useRouter();
  const logOut = async () => {
    localStorage.removeItem("enterSend");
    resetCall();
    resetChats();
    resetSettings();
    resetStatus();
    resetUser();
    chatSocket.disconnect();
    try {
      await logoutAction();
      router.replace("/");
    } catch (error) {
      console.log({ error });
    }
  };
  return { logOut };
};

export default useLogout;
