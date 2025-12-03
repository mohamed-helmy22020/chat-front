import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";

const usePageFocus = () => {
  const changeIsFocus = useSettingsStore((state) => state.changeIsFocus);
  useEffect(() => {
    const handleBlur = () => {
      changeIsFocus(false);
    };

    const handleFocus = () => {
      changeIsFocus(true);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [changeIsFocus]);
};
export default usePageFocus;
