import { addUserToGroup } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const useInviteGroup = () => {
  const tError = useTranslations("Errors");
  const t = useTranslations("RequestUserCard.InviteGroup");
  const { inviteGroup, changeInviteGroup } = useChatStore(
    useShallow((state) => ({
      inviteGroup: state.inviteGroup,
      changeInviteGroup: state.changeInviteGroup,
    })),
  );

  const inviteToGroup = async (userIdOrEmail: string) => {
    if (!inviteGroup || !userIdOrEmail) return;

    const toastId = toast.loading(t("InvitingUser"));
    const inviteUserRes = await addUserToGroup(inviteGroup.id, userIdOrEmail);

    toast.dismiss(toastId);

    if (!inviteUserRes.success) {
      return toast.error(tError(convertErrors(inviteUserRes.msg)));
    }

    toast.success(t("UserAddedSuccess"));
    changeInviteGroup(null);
  };

  return { inviteToGroup };
};

export default useInviteGroup;
