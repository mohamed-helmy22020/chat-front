import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { LuCheck, LuUserRoundX } from "react-icons/lu";
import PageAbout from "./PageAbout";
import RequestUserCard from "./RequestUserCard";
import { Alert, AlertTitle } from "./ui/alert";

const BlockedList = () => {
  const t = useTranslations("BlockedList");
  const blockedList = useUserStore((state) => state.blockedList);

  const friendsListElements = blockedList.map((user) => (
    <RequestUserCard key={user._id} user={user} type="blocks" />
  ));
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col border-e-2 md:w-5/12">
        <div className="flex items-center justify-between p-5">
          <h1>{t("BlockedList")}</h1>
        </div>

        {friendsListElements.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2">
            {friendsListElements}
          </div>
        ) : (
          <div className="p-5">
            <Alert className="bg-site-foreground">
              <LuCheck />
              <AlertTitle>{t("NoBlocks")}</AlertTitle>
            </Alert>
          </div>
        )}
      </div>
      <PageAbout
        title={t("BlockedList")}
        about1={t("About1")}
        about2={t("About2")}
      >
        <LuUserRoundX size={100} />
      </PageAbout>
    </div>
  );
};

export default BlockedList;
