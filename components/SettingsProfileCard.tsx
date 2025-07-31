import { useUserStore } from "@/store/userStore";
import Image from "next/image";

const SettingsProfileCard = () => {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex min-h-15 w-full cursor-pointer rounded-md px-3 py-1.5 hover:bg-site-foreground">
      <div className="me-2 flex items-center">
        <Image
          className="rounded-full object-cover"
          src={user?.userProfileImage || "/imgs/user.jpg"}
          alt="avatar"
          width={40}
          height={40}
        />
      </div>
      <div className="flex flex-1 flex-col items-start justify-center">
        <h1 className="text-md font-bold capitalize">{user?.name}</h1>
        {user?.bio && (
          <p className="line-clamp-1 text-sm text-gray-500">{user?.bio}</p>
        )}
      </div>
    </div>
  );
};

export default SettingsProfileCard;
