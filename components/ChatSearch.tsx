import { Input } from "./ui/input";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};
const ChatSearch = ({ search, setSearch }: Props) => {
  return (
    <div className="px-5 pb-3">
      <Input
        className="rounded-sm"
        placeholder="Search for conversation by user name or last message."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default ChatSearch;
