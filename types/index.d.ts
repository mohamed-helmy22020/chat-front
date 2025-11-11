type SignUpDataType = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type SignInDataType = {
  email: string;
  password: string;
};

type UserType = {
  _id: string;
  email: string;
  bio: string;
  isEmailVerified: string;
  isPhoneVerified: string;
  name: string;
  phone: string;
  userId: string;
  userProfileImage: string;
  accessToken?: string;
};
type MiniUserType = Pick<UserType, "_id" | "name" | "userProfileImage">;

type RequestUserType = {
  _id: string;
  name: string;
  userProfileImage?: string;
  bio?: string;
  email?: string;
  isFriend?: boolean;
  isSentRequest?: boolean;
  isReceivedRequest?: boolean;
};

type ConversationType = {
  id: string;
  participants: participant[];
  lastMessage: MessageType;
  createdAt: "2025-04-30T02:40:34.873Z";
  updatedAt: "2025-04-30T22:40:08.395Z";
};

type participant = {
  userProfileImage: string;
  _id: string;
  name: string;
};

type MessageType = {
  conversationId;
  seen: boolean;
  id: string;
  from: string;
  to: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

type FriendsStatusType = {
  _id: string;
  userId: MiniUserType;
  content: string;
  expiresAt: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
  isSeen: boolean;
};

type UserStatusType = Omit<FriendsStatusType, "isSeen"> & {
  viewers: MiniUserType;
};

type CurrentStatusType = {
  isMe: boolean;
  statuses: FriendsStatusType[] | UserStatusType[];
  userId: string;
  count: number;
  currentIndex: number;
};
