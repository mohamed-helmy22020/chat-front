import { createGroup as createGroupAction } from "@/lib/actions/user.actions";
import { useChatStore } from "@/store/chatStore";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { IoAlertCircleSharp } from "react-icons/io5";
import { getLangDir } from "rtl-detect";
import { Alert, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
type Props = {
  setShowCreateGroup: (value: boolean) => void;
};

const NewGroupMenu = ({ setShowCreateGroup }: Props) => {
  const tError = useTranslations("Errors");
  const t = useTranslations("Groups.NewGroupMenu");
  const locale = useLocale();
  const dir = getLangDir(locale);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [groupData, setGroupData] = useState({
    name: "",
    desc: "",
  });
  const addGroup = useChatStore((state) => state.addConversation);

  const createGroup = async () => {
    if (!groupData.name || !groupData.desc) {
      setError("FillAllFields");
      return;
    }
    setError("");
    setIsCreating(true);
    try {
      const createGroupRes = await createGroupAction(groupData);
      if (!createGroupRes.success) {
        throw new Error(createGroupRes.msg);
      }
      addGroup(createGroupRes.group);
      setShowCreateGroup(false);
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
    setIsCreating(false);
  };
  return (
    <div
      className={clsx(
        "flex max-h-svh w-full flex-col overflow-hidden border-e-2 border-site-foreground sm:flex md:w-5/12",
      )}
    >
      <div className="flex items-center p-5 select-none">
        <button
          onClick={() => setShowCreateGroup(false)}
          className="cursor-pointer pe-2"
        >
          {dir === "ltr" ? (
            <FaArrowLeft className="transition hover:-translate-x-1" />
          ) : (
            <FaArrowRight className="transition hover:translate-x-1" />
          )}
        </button>
        <p>{t("NewGroup")}</p>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <Input
          placeholder={t("GroupName")}
          className="rounded-sm focus-visible:ring-0"
          value={groupData.name}
          onChange={(e) =>
            setGroupData((prev) => {
              return { ...prev, name: e.target.value };
            })
          }
        />
        <Textarea
          placeholder={t("GroupDesc")}
          className="max-h-32 rounded-sm focus-visible:ring-0"
          value={groupData.desc}
          onChange={(e) =>
            setGroupData((prev) => {
              return { ...prev, desc: e.target.value };
            })
          }
        />
        {error && (
          <Alert variant="destructive">
            <IoAlertCircleSharp />
            <AlertTitle>{tError(error)}</AlertTitle>
          </Alert>
        )}
        <Button variant="main" onClick={createGroup} disabled={isCreating}>
          {isCreating ? <Loader2 className="animate-spin" /> : t("CreateGroup")}
        </Button>
      </div>
    </div>
  );
};

export default NewGroupMenu;
