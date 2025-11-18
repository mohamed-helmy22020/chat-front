import { formatDateToStatus, REACTS } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import {
  AiTwotoneDislike as DislikeEmoji,
  AiTwotoneLike as LikeEmoji,
} from "react-icons/ai";
import { BsFillEmojiSurpriseFill as WowEmoji } from "react-icons/bs";
import { FaAngry as AngryEmoji } from "react-icons/fa";
import {
  FaFaceLaughBeam as LaughEmoji,
  FaFaceSadTear as SadEmoji,
} from "react-icons/fa6";
import { FcLike as LoveEmoji } from "react-icons/fc";
import { RiCheckDoubleFill } from "react-icons/ri";
import MessageMenu from "./MessageMenu";
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
  const reactsElements: React.JSX.Element[] = [];
  [...message.reacts]
    .sort((a, b) => a.react.toLowerCase().localeCompare(b.react.toLowerCase()))
    .forEach((react, i, arr) => {
      if (i !== 0 && arr[i - 1].react === react.react) {
        return;
      }
      if (react.react === REACTS.like.name) {
        reactsElements.push(<LikeEmoji key={react.react} />);
      } else if (react.react === REACTS.dislike.name) {
        reactsElements.push(<DislikeEmoji key={react.react} />);
      } else if (react.react === REACTS.love.name) {
        reactsElements.push(<LoveEmoji key={react.react} />);
      } else if (react.react === REACTS.laugh.name) {
        reactsElements.push(<LaughEmoji key={react.react} color="#ffcc4d" />);
      } else if (react.react === REACTS.wow.name) {
        reactsElements.push(<WowEmoji key={react.react} color="#ffcc4d" />);
      } else if (react.react === REACTS.sad.name) {
        reactsElements.push(<SadEmoji key={react.react} color="#ffcc4d" />);
      } else if (react.react === REACTS.angry.name) {
        reactsElements.push(<AngryEmoji key={react.react} color="#ffcc4d" />);
      }
    });
  if (isMine) {
    return (
      <div
        className={clsx(
          "mb-[1px] flex flex-row-reverse items-center justify-start break-words break-all",
          isFirstMessage && "mt-3",
        )}
      >
        <div
          className={clsx(
            "peer relative max-w-4/5 ps-1",
            message.reacts && message.reacts.length > 0 && "mb-[22px]",
          )}
        >
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
          {message.reacts && message.reacts.length > 0 && (
            <div className="absolute end-2 bottom-1 z-50 flex translate-y-full items-center justify-center gap-1 rounded-full bg-site-foreground px-2 py-1 text-sm select-none">
              <div className="flex gap-0.5">{reactsElements}</div>
              {message.reacts.length}
            </div>
          )}
        </div>
        <MessageMenu message={message} />
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "mb-[1px] flex items-center break-words break-all",
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
      <div
        className={clsx(
          "peer relative ms-2 max-w-4/5 pe-1",
          message.reacts && message.reacts.length > 0 && "mb-[22px]",
        )}
      >
        <div className="message-bubble rounded-xs bg-white px-2 py-2 shadow-sm dark:bg-slate-600">
          <pre className="text-sm break-words">{message.text}</pre>
          <div className="mt-1 ml-1 flex items-center justify-end text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              {formatDateToStatus(message.createdAt)}
            </p>
          </div>
        </div>
        {message.reacts && message.reacts.length > 0 && (
          <div className="absolute end-2 bottom-1 z-50 flex translate-y-full items-center justify-center gap-1 rounded-full bg-site-foreground px-2 py-1 text-xs select-none">
            <div className="flex gap-0.5">{reactsElements}</div>
            {message.reacts.length}
          </div>
        )}
      </div>
      <MessageMenu message={message} />
    </div>
  );
};

export default ConversationMessage;
