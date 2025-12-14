import { fetchWithErrorHandling, MAX_FILE_SIZE } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { ImageUpIcon, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";

interface FileError {
  type: "file-type" | "file-size" | "upload-failed" | null;
  message: string;
}
const ProfilePictureUpdate = () => {
  const t = useTranslations("Settings.Profile");
  const [image, setImage] = useState<string | ArrayBuffer | null>();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<FileError>({ type: null, message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, changeUserData } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      changeUserData: state.changeUserData,
    })),
  );

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
      formData.append("profilePicture", file);

      const response = await fetchWithErrorHandling("/user/data", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      if (!response.success) {
        throw new Error(response.msg);
      }
      changeUserData({
        userProfileImage: response.user.userProfileImage,
      });
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
          alt="User Profile Image"
          src={(image as string) || user?.userProfileImage || "/imgs/user.jpg"}
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
            name={"profilePicture"}
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

export default ProfilePictureUpdate;
