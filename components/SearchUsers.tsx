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
import { validateEmail } from "@/lib/utils";
import { IoAlertCircleSharp } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";

import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import RequestUserCard from "./RequestUserCard";
import { Alert, AlertTitle } from "./ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SearchUsers = () => {
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<RequestUserType | null>();

  const resetData = (open: boolean) => {
    setIsOpen(open);
    setEmail("");
    setSearchedUsers(undefined);
  };
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      if (!email) throw new Error("Email is required.");
      if (!validateEmail(email)) throw new Error("Invalid email.");
      const searchUserRes = await findUser(email);
      console.log(searchUserRes);
      if (!searchUserRes.success) throw new Error(searchUserRes.msg);
      setSearchedUsers(searchUserRes.user);
    } catch (error) {
      console.log(error);
      setSearchedUsers(null);
    }
    setIsSearching(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={resetData}>
      <DialogTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="cursor-pointer" variant="ghostFull">
                <CiCirclePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="rounded-full"
              sideOffset={0}
            >
              <p>Add Friend</p>
            </TooltipContent>
          </Tooltip>
        </div>
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
              {isSearching ? <LuLoader className="animate-spin" /> : "Search"}
            </Button>
          </div>
          <div>
            {searchedUsers && !isSearching ? (
              <RequestUserCard
                user={searchedUsers}
                type={
                  searchedUsers.isFriend
                    ? "friends"
                    : searchedUsers.isReceivedRequest
                      ? "request"
                      : searchedUsers.isSentRequest
                        ? "sent"
                        : "addFriend"
                }
              />
            ) : searchedUsers === null && !isSearching ? (
              <Alert variant="destructive">
                <IoAlertCircleSharp />
                <AlertTitle>User with this email doesn&apos;t exist</AlertTitle>
              </Alert>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchUsers;
