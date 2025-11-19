import { fetchWithErrorHandling } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { Check, Loader, Pen } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ProfileBio = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BIO_LENGTH = 140;
  const { bio, accessToken, changeUserData } = useUserStore(
    useShallow((state) => ({
      bio: state.user?.bio,
      accessToken: state.user?.accessToken,
      changeUserData: state.changeUserData,
    })),
  );
  const [bioState, setBioState] = useState(bio);

  const handleUpdateBio = async () => {
    if (bioState === bio) {
      setIsEditing(false);
      return;
    }
    if (bioState === "") {
      setBioState(bio);
      setIsEditing(false);
      return;
    }
    const formData = new FormData();
    formData.append("bio", bioState as string);
    try {
      setIsLoading(true);
      const response = await fetchWithErrorHandling("/user/data", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.success) {
        throw new Error(response.msg);
      }
      changeUserData({
        bio: response.user.bio,
      });
    } catch (error) {
      console.error("Error updating Bio:", error);
      setBioState(bio);
      return;
    } finally {
      setIsLoading(false);
    }

    setIsEditing(false);
  };
  return (
    <div className="flex flex-col text-sm">
      <p className="text-gray-400">About</p>
      <div className="flex items-center justify-between">
        {!isEditing && (
          <>
            <p>{bio || "NoBio"}</p>
            <Button
              onClick={() => {
                setIsEditing(true);
                setBioState(bio);
              }}
              variant="ghostFull"
              className="cursor-pointer"
            >
              <Pen />
            </Button>
          </>
        )}
        {isEditing && (
          <>
            <div className="relative flex-1">
              <Input
                type="text"
                className="w-full border-0 border-b-2 !bg-transparent !ring-0"
                autoFocus
                value={bioState}
                onChange={(e) => {
                  if (e.target.value.length <= BIO_LENGTH) {
                    setBioState(e.target.value);
                  }
                }}
              />
              <div className="absolute right-0 -bottom-1 flex h-full items-center justify-center text-gray-400 select-none">
                {BIO_LENGTH - parseInt(bioState?.length.toString() as string)}
              </div>
            </div>
            <Button
              onClick={handleUpdateBio}
              variant="ghostFull"
              className="cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin" /> : <Check />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileBio;
