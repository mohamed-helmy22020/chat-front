import { Check, EllipsisVertical, Loader, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

type Props = {
  user: RequestUserType;
  type?: "friends" | "blocks" | "request" | "sent" | "addFriend";
};

const RequestUserCard = ({
  user: { userProfileImage, name },
  type = "friends",
}: Props) => {
  return (
    <div className="flex w-full cursor-pointer rounded-md px-3 py-1.5 hover:bg-site-foreground">
      <div className="me-2 flex items-center">
        <Image
          className="rounded-full object-cover"
          src={userProfileImage || "/imgs/user.jpg"}
          alt="avatar"
          width={25}
          height={25}
        />
      </div>
      <div className="flex flex-1 flex-col items-start">
        <h1 className="text-md font-bold capitalize">{name}</h1>
        <p className="line-clamp-1 text-sm text-gray-500">
          wefwefwe ewfwef fwefwef wefwef
        </p>
      </div>
      <div className="flex items-center text-gray-300">
        {(type === "friends" && <FriendsMenu />) ||
          (type === "blocks" && <BlocksMenu />) ||
          (type === "request" && <RequestsMenu />) ||
          (type === "sent" && <SentMenu />) ||
          (type === "addFriend" && <AddFriendMenu />)}
      </div>
    </div>
  );
};

const FriendsMenu = () => {
  return <EllipsisVertical />;
};
const BlocksMenu = () => {
  return <EllipsisVertical />;
};
const RequestsMenu = () => {
  return <EllipsisVertical />;
};
const SentMenu = () => {
  return <EllipsisVertical />;
};
const AddFriendMenu = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const handleAddingFriend = async () => {
    setIsSending(true);
    try {
      // await sendFriendRequest(user._id);
      setIsSent(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Button
      variant="ghostFull"
      className="cursor-pointer rounded-full p-1 hover:scale-110"
      title="Add Friend"
      disabled={isSending || isSent}
      onClick={handleAddingFriend}
    >
      {isSending ? (
        <Loader className="animate-spin" />
      ) : isSent ? (
        <Check />
      ) : (
        <PlusCircle />
      )}
    </Button>
  );
};

export default RequestUserCard;
