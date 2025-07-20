import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findUser } from "@/lib/actions/user.actions";
import { Loader, PlusCircle } from "lucide-react";
import { useState } from "react";
import RequestUserCard from "./RequestUserCard";

const SearchUsers = () => {
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const searchUserRes = await findUser(email);
      console.log(searchUserRes.user);
    } catch (error) {
      console.log(error);
    }
    setIsSearching(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="" variant="ghost">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search for user</DialogTitle>
          <DialogDescription>
            NOTE: You need to write the full email
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Button
              variant="default"
              className="cursor-pointer bg-gray-600 text-white hover:bg-gray-700"
              disabled={isSearching}
              onClick={handleSearch}
            >
              {isSearching ? <Loader className="animate-spin" /> : "Search"}
            </Button>
          </div>
          <div>
            <RequestUserCard
              user={{
                userProfileImage: "/imgs/user.jpg",
                name: "John Doe",
                _id: "12345",
              }}
              type="addFriend"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchUsers;
