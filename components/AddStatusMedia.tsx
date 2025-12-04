import {
  allowedPictureTypes,
  allowedVideoTypes,
  fetchWithErrorHandling,
} from "@/lib/utils";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  setShowAddMedia: React.Dispatch<React.SetStateAction<boolean>>;
  file: File;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
};
const AddStatusMedia = ({ setShowAddMedia, setSelectedFile, file }: Props) => {
  const mediaUrl = useMemo(() => {
    return URL.createObjectURL(file);
  }, [file]);

  const user = useUserStore((state) => state.user);
  const [isSending, setIsSending] = useState(false);
  const [caption, setCaption] = useState("");
  const addUserStatus = useStatusStore((state) => state.addUserStatus);
  const handleSendStatus = async () => {
    setIsSending(true);
    const formData = new FormData();
    formData.append("statusMedia", file);
    formData.append("content", caption);
    try {
      const response = await fetchWithErrorHandling("/status", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      if (!response.success) {
        throw new Error(response.msg);
      }
      setShowAddMedia(false);
      setSelectedFile(null);
      setCaption("");
      addUserStatus(response.status);
      toast.success("Status added successfully!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.msg);
    }
    setIsSending(false);
  };
  return (
    <div className="fixed top-0 left-0 z-50 flex h-svh w-screen flex-col overflow-hidden bg-site-background">
      <div className="flex items-start justify-start px-3 py-3">
        <Button
          className="scale-110 cursor-pointer"
          variant="ghostFull"
          onClick={() => {
            setShowAddMedia(false);
            setSelectedFile(null);
          }}
        >
          <X />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center py-5">
        {allowedPictureTypes.includes(file.type) && (
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              unoptimized
              src={mediaUrl}
              alt="status"
              fill
              className="object-contain"
            />
          </div>
        )}
        {allowedVideoTypes.includes(file.type) && (
          <div className="relative flex h-full max-h-full w-full max-w-full items-center justify-center">
            <video
              src={mediaUrl}
              autoPlay
              className="absolute max-h-full max-w-full object-contain"
              controls
              muted
              controlsList="nofullscreen nodownload noremoteplayback noplaybackrate"
              disablePictureInPicture
              disableRemotePlayback
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center pb-10">
        <div className="flex w-xl justify-center">
          <div className="flex-1">
            <Input
              className="w-full rounded-sm border-0 !bg-site-foreground ring-0 placeholder:text-white"
              placeholder="Add a caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isSending}
            />
          </div>
          <div>
            <Button
              variant="ghostFull"
              className="cursor-pointer"
              onClick={handleSendStatus}
              disabled={isSending}
            >
              {isSending ? <Loader2 className="animate-spin" /> : <IoMdSend />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStatusMedia;
