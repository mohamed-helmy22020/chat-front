import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { IoAlertCircleSharp } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import PageAbout from "./PageAbout";
import ReceivedRequestsList from "./ReceivedRequestsList";
import RequestUserCard from "./RequestUserCard";
import SearchUsers from "./SearchUsers";
import SentRequestsList from "./SentRequestsList";
import { Alert, AlertTitle } from "./ui/alert";

const FriendsList = () => {
  const t = useTranslations("Friends");
  const friendsList = useUserStore((state) => state.friendsList);

  const friendsListElements = friendsList.map((friend) => (
    <RequestUserCard key={friend._id} user={friend} />
  ));
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
        <div className="flex items-center justify-between p-5">
          <h1>{t("FriendsList")}</h1>
          <div className="flex">
            <SentRequestsList />
            <ReceivedRequestsList />
            <SearchUsers />
          </div>
        </div>

        {friendsListElements.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2">
            {friendsListElements}
          </div>
        ) : (
          <div className="p-5">
            <Alert variant="warning" className="bg-site-foreground">
              <IoAlertCircleSharp />
              <AlertTitle>{t("NoFriends")}</AlertTitle>
            </Alert>
          </div>
        )}
      </div>
      <PageAbout
        title={t("FriendsList")}
        about1={t("About1")}
        about2={t("About2")}
      >
        <LuUsers size={100} />
      </PageAbout>
    </div>
  );
};

export default FriendsList;
