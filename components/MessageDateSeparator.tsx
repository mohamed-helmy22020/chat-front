import { formateDateWithLabel } from "@/lib/utils";

type Props = {
  date: string;
};

const MessageDateSeparator = ({ date }: Props) => {
  return (
    <div className="flex items-center justify-center text-xs text-gray-300">
      <div className="rounded-sm bg-site-foreground px-3 py-1">
        {formateDateWithLabel(date)}
      </div>
    </div>
  );
};

export default MessageDateSeparator;
