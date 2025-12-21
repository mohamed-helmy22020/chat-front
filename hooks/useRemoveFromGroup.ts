import { removeUserFromGroup } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const useRemoveFromGroup = () => {
  const tError = useTranslations("Errors");
  const t = useTranslations("RequestUserCard.InviteGroup");

  const removeFromGroup = async (groupId: string, userIdOrEmail: string) => {
    if (!groupId || !userIdOrEmail) return;

    const toastId = toast.loading(t("RemovingUser"));
    const inviteUserRes = await removeUserFromGroup(groupId, userIdOrEmail);

    toast.dismiss(toastId);

    if (!inviteUserRes.success) {
      return toast.error(tError(convertErrors(inviteUserRes.msg)));
    }

    toast.success(t("UserRemovedSuccess"));
  };

  return { removeFromGroup };
};

export default useRemoveFromGroup;
