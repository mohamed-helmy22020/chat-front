import { useTranslations } from "next-intl";
import { Input } from "./ui/input";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};
const ChatSearch = ({ search, setSearch }: Props) => {
  const t = useTranslations("Chat.ConversationsList");
  return (
    <div className="px-5 pb-3">
      <Input
        className="rounded-sm focus-visible:ring-0"
        placeholder={t("Search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default ChatSearch;
