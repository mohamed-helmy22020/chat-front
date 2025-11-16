import { formatDateToStatus } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import { RiCheckDoubleFill } from "react-icons/ri";
type Props = {
  message: MessageType;
  isMine: boolean;
  isFirstMessage: boolean;
  otherSide: participant;
};
const ConversationMessage = ({
  message,
  isMine,
  isFirstMessage,
  otherSide,
}: Props) => {
  if (isMine) {
    return (
      <div
        className={clsx(
          "mb-[1px] flex items-start justify-end break-words break-all",
          isFirstMessage && "mt-3",
        )}
      >
        <div>
          <div className="message-bubble self rounded-xs bg-mainColor-100 px-2 py-2 shadow-sm dark:bg-mainColor-900">
            <pre className="text-sm break-words">{message.text}</pre>
            <div className="mt-1 mr-1 flex items-center justify-between gap-2 text-right text-xs">
              <p className="text-slate-200">
                <RiCheckDoubleFill />
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {formatDateToStatus(message.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "mb-[1px] flex items-start break-words break-all",
        isFirstMessage && "mt-3",
      )}
    >
      {isFirstMessage ? (
        <Image
          width={40}
          height={40}
          src={otherSide.userProfileImage || "/imgs/user.jpg"}
          className="rounded-full border-2 border-white dark:border-slate-800"
          alt="user-1"
        />
      ) : (
        <div className="h-10 w-10 flex-shrink-0"></div>
      )}
      <div className="ms-2">
        <div className="message-bubble rounded-xs bg-white px-2 py-2 shadow-sm dark:bg-slate-600">
          <pre className="text-sm break-words">{message.text}</pre>
          <div className="mt-1 ml-1 flex items-center justify-end text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              {formatDateToStatus(message.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationMessage;
