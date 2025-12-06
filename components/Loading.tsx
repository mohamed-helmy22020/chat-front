import { useSettingsStore } from "@/store/settingsStore";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import ProgressBar from "./ProgressBar";

const Loading = () => {
  const { loadingProgress } = useSettingsStore(
    useShallow((state) => ({
      isLoadingData: state.isLoadingData,
      loadingProgress: state.loadingProgress,
    })),
  );
  return (
    <div className="fixed top-0 left-0 z-[51] flex h-svh w-screen items-center justify-center bg-site-background">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image
          src="/imgs/icon.png"
          width={100}
          height={100}
          alt="website icon"
          priority={true}
        />
        <p className="text-center text-xl">Chat App</p>
        <ProgressBar min={0} max={100} value={loadingProgress} width={200} />
      </div>
    </div>
  );
};

export default Loading;
