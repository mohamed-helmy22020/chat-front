declare module "react-range-slider-input";
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

type InstructorDetailsType = {
  id: string;
  name: string;
  userProfileImage: string;
};

type CoursesType = {
  courses: CourseType[];
  nbHits: number;
};

type CourseType = {
  id: string;
  instructorDetails: InstructorDetailsType;
  title: string;
  description: string;
  price: string;
  picture: string;
  overview: string;
  overviewPlaybackUrl?: string;
  category: string;
  rates: number[];
  rating: number;
  lecturesCount: number;
  createdAt: string;
  isFav: boolean;
  lectures: [
    {
      id: string;
      title: string;
    },
  ];
  students: number;
  userRate?: number;
  lecturesFinished?: number;
};

type LectureType = {
  lectureId: string;
  title: string;
  description: string;
  videoUrl: string;
  playbackUrl: string;
  thumbnailUrl: string;
  courseId: string;
  lectureNumber: number;
  instructorId: string;
  rates: number[];
  rating: number;
  createdAt: string;
  duration: number;
  progress: {
    duration: number;
    isDone: boolean;
  };
};

type CouponType = {
  id: string;
  coupon: string;
  courseId: string;
  discountPercentage: number;
  numberOfUses: number;
  userLimit: number;
  expiryDate: string;
};

type FiltersType = {
  search?: string;
  title?: string;
  description?: string;
  category?: string;
  numericFilters?: string;
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
};

type getAllCoursesType = "all" | "enrolled" | "uploaded" | "fav";

type NoteType = {
  id: string;
  note: string;
  videoSeconds: number;
  lecture: {
    _id: string;
    title: string;
    lectureNumber: number;
  };
};

type InstructorType = {
  userProfileImage: string;
  _id: string;
  name: string;
  email: string;
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

type NotificationType = {
  id: string;
  recipient: string;
  type: "new_lecture" | "course_purchased";
  course: {
    _id: string;
    title: string;
    picture: string;
    students: number;
  };
  lecture?: {
    _id: string;
    title: string;
    thumbnailUrl: string;
  };
  count: number;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
};
