import { fetchWithErrorHandling, MAX_FILE_SIZE } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { ImageUpIcon, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

interface FileError {
  type: "file-type" | "file-size" | "upload-failed" | null;
  message: string;
}
const GroupPictureUpdate = () => {
  const t = useTranslations("Group");
  const [image, setImage] = useState<string | ArrayBuffer | null>();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<FileError>({ type: null, message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const group = useChatStore((state) => state.currentConversation) as Extract<
    ConversationType,
    { type: "group" }
  >;
  const accessToken = useUserStore((state) => state.user?.accessToken);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError({
        type: "file-type",
        message: t("OnlyImageError"),
      });
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      setError({
        type: "file-size",
        message: t("FileSizeError"),
      });
      return;
    }

    setError({ type: null, message: "" });
    setIsUploading(true);

    try {
      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("groupPicture", file);

      const response = await fetchWithErrorHandling(`/chat/group/${group.id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.success) {
        throw new Error(response.msg);
      }
      // Update the image state with the uploaded URL
      setImage(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError({
        type: "upload-failed",
        message: t("UploadingImageError"),
      });
      // Revert to previous image on error
      setImage(undefined);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="group picture relative aspect-square h-40 overflow-hidden rounded-full">
        <Image
          alt="Group Image"
          src={(image as string) || group.groupImage || "/imgs/group.jpg"}
          className="h-full w-full object-cover"
          fill
        />
        <div
          className={`changePicture invisible absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black opacity-75 group-hover:visible ${isUploading && "visible"}`}
        >
          {isUploading ? (
            <>
              <Loader className="animate-spin" /> {t("Uploading")}
            </>
          ) : (
            <Button
              onClick={handleUploadClick}
              variant="link"
              className="text-white"
            >
              <ImageUpIcon /> {t("ChangePicture")}
            </Button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            name={"groupPicture"}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>
      {error && (
        <span className="mt-4 text-center text-sm text-red-500">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default GroupPictureUpdate;
