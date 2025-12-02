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
  isOnline?: boolean;
};

type ReceiveMessageType = {
  success: boolean;
  message: MessageType;
  conversation: ConversationType;
};

type OnTypingRes = {
  conversationId: string;
  isTyping: boolean;
};

type ConversationType = {
  id: string;
  participants: participant[];
  lastMessage: Omit<MessageType, "conversationId">;
  isTyping?: boolean;
  createdAt: string;
  updatedAt: string;
};

type participant = {
  userProfileImage: string;
  _id: string;
  name: string;
};

type MessageType = {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  text: string;
  seen: boolean;
  reacts: ReactType[];
  createdAt: string;
  updatedAt: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "";
  type?: "pending" | "received";
};
type ReactsType = Record<
  string,
  {
    id: number;
    name: "Like" | "Dislike" | "Love" | "Laugh" | "Wow" | "Sad" | "Angry";
  }
>;
type ReactType = {
  react: "Like" | "Dislike" | "Love" | "Laugh" | "Wow" | "Sad" | "Angry";
  user: participant;
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
  viewers: {
    user: MiniUserType;
    createdAt: string;
  }[];
};

type CurrentStatusType = {
  isMe: boolean;
  statuses: FriendsStatusType[] | UserStatusType[];
  userId: string;
  count: number;
  currentIndex: number;
};
