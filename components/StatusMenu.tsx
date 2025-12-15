import { deleteStatus as deleteStatusAction } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { useStatusStore } from "@/store/statusStore";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "next-intl";
import { LuEllipsisVertical } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const StatusMenu = () => {
  const tError = useTranslations("Errors");
  const t = useTranslations("Status.Overlay");

  const userId = useUserStore((state) => state.user?._id);
  const { currentStatus, deleteUserStatus, changeCurrentStatus } =
    useStatusStore(
      useShallow((state) => ({
        currentStatus: state.currentStatus,
        deleteUserStatus: state.deleteUserStatus,
        changeCurrentStatus: state.changeCurrentStatus,
      })),
    );
  const currentOpenedStatus =
    currentStatus?.statuses[currentStatus.currentIndex];

  const deleteStatus = async () => {
    try {
      const toastId = toast.loading(t("DeletingStatus"));
      const deleteStatusRes = await deleteStatusAction(
        currentOpenedStatus?._id as string,
      );
      if (!deleteStatusRes.success) {
        throw new Error(deleteStatusRes.message);
      }
      deleteUserStatus(currentOpenedStatus?._id as string);
      changeCurrentStatus(userId as string, true);
      toast.dismiss(toastId);
      toast.success(t("StatusDeletedSuccess"));
    } catch (error: any) {
      console.log(error);
      toast.error(tError(convertErrors(error.message)));
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="mx-4 cursor-pointer rounded-full p-1"
          variant="ghostFull"
        >
          <LuEllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={deleteStatus}>
          <MdDelete />
          {t("DeleteStatus")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusMenu;
