import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const convertErrors = (error: string) => {
  const errors = {
    "email is already exist": "EmailExist",
    "phone is already exist": "PhoneExist",
    "Invalid Credentials": "InvalidCredentials",
    "Email is required": "EmailRequired",
    "No user with this email": "NoUserWithThisEmail",
    "Please fill all the fields": "FillAllFields",
    "Code must be 6 characters long": "Code6",
    "Code must be a number": "CodeNumber",
    "Password must be at least 10 characters long": "Password10",
    "Invalid code": "InvalidCode",
    "Network error or server is unreachable.": "NetworkError",
    "You are not authenticated": "NotAuth",
    "Invalid file type. Only images are allowed.": "OnlyImage",
    "current password is incorrect": "CurrentPasswordIncorrect",
    "Failed to send reset password code": "SendResetCodeFailed",
    "Failed to send verification code": "SendVerificationCodeFailed",
    "Reset password code sent to your email": "SendResetCodeSuccess",
    "Password reset successfully": "PasswordResetSuccessfully",
    "This email is used": "EmailIsUsed",
    "This phone is used": "PhoneIsUsed",
    "Email is already verified": "EmailAlreadyVerified",
    "Invalid verification code": "InvalidVerificationCode",
    "Can't add yourself as a friend": "AddYourselfFriendError",
    "Content or media is required": "StatusContentRequired",
    "Error uploading media": "ErrorUploadingMedia",
    "Status not found": "StatusNotFound",
    "Message text or media is required.": "MessageContentRequired",
    "Invalid call type": "InvalidCallType",
    "User is not online": "UserNotOnline",
    "No user with this id": "NoUserWithId",
    "Can't call this user": "CantCallUser",
    "Please provide messageId and the person": "ProvideMessageIdAndPerson",
    "No message with this id": "NoMessageWithId",
    "You can't forward this message": "CantForwardMessage",
    "You can't forward this message to this user": "CantForwardMessageToUser",
  };
  console.log(error, errors[error as keyof typeof errors]);
  return errors[error as keyof typeof errors] || "UnknownError";
};

export const fetchAbsolute = (url: string, init?: RequestInit) => {
  if (url.startsWith("/"))
    return fetch(process.env.NEXT_PUBLIC_BASE_URL + url, init);
  else return fetch(url, init);
};

export const fetchWithErrorHandling = async (
  url: string,
  init?: RequestInit,
) => {
  try {
    const response = await fetchAbsolute(url, init);

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return await response.json();
  } catch (error: any) {
    if (error.name === "TypeError") {
      error.msg = "Network error or server is unreachable.";
    } else {
      error.msg = error.msg;
    }
    throw error;
  }
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
export function formateDateWithLabel(dateString: string) {
  const inputDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDateOnly = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  let label;
  if (inputDateOnly.getTime() === todayOnly.getTime()) {
    label = "Today";
  } else if (inputDateOnly.getTime() === yesterdayOnly.getTime()) {
    label = "Yesterday";
  } else {
    label = inputDate.toLocaleDateString();
  }
  return label;
}
export function formatDateToStatus(dateString: string) {
  const inputDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDateOnly = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  let label;
  if (inputDateOnly.getTime() === todayOnly.getTime()) {
    label = "Today";
  } else if (inputDateOnly.getTime() === yesterdayOnly.getTime()) {
    label = "Yesterday";
  } else {
    label = inputDate.toLocaleDateString();
  }
  return label;

  // Format time: 6:06 AM (no seconds, with AM/PM)
  const timeStr = inputDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${label}, ${timeStr}`;
}

export function formatRelativeDate(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - inputDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // If more than 7 days ago, format as DD/MM/YYYY
  if (diffDays > 7) {
    const day = String(inputDate.getDate()).padStart(2, "0");
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
    const year = inputDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Less than 1 minute ago → "just now"
  if (diffMinutes < 1) {
    return "just now";
  }

  // Minutes
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  // Hours
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  // Days (1 to 7)
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function sortStatuses(statuses: FriendsStatusType[]) {
  const sorted = [...statuses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const object: Record<string, FriendsStatusType[]> = {};
  for (const item of sorted) {
    if (item.userId._id in object) {
      object[item.userId._id].push(item);
    } else {
      object[item.userId._id] = [item];
    }
  }
  return Object.values(object);
}

export function isTextExceeded(
  text: string,
  maxChar: number = 700,
  maxLine: number = 5,
) {
  if (!text || typeof text !== "string") {
    return false;
  }

  const charCount = text.length;
  const lineCount = text.split("\n").length;

  return charCount > maxChar || lineCount > maxLine;
}

export function getFontSizeForText(textLength: number, options: any = {}) {
  // Default options
  const {
    minFontSize = 25, // Minimum font size (px)
    maxFontSize = 64, // Maximum font size (px)
    minLength = 1, // Text length at which to use maxFontSize
    maxLength = 200, // Text length at which to use minFontSize
  } = options;

  if (!textLength || typeof textLength !== "number") {
    return `${maxFontSize}px`;
  }

  // If length is outside the range, clamp the font size
  if (textLength <= minLength) return maxFontSize;
  if (textLength >= maxLength) return minFontSize;

  // Linear interpolation between max and min font size
  const fontSize =
    maxFontSize -
    ((textLength - minLength) / (maxLength - minLength)) *
      (maxFontSize - minFontSize);

  return `${Math.ceil(fontSize)}px`;
}

export const REACTS: ReactsType = {
  like: {
    id: 0,
    name: "Like",
  },
  dislike: {
    id: 1,
    name: "Dislike",
  },
  love: {
    id: 2,
    name: "Love",
  },

  laugh: {
    id: 3,
    name: "Laugh",
  },
  wow: {
    id: 4,
    name: "Wow",
  },
  sad: {
    id: 5,
    name: "Sad",
  },
  angry: {
    id: 6,
    name: "Angry",
  },
};
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
export const allowedPictureTypes = ["image/jpeg", "image/png", "image/gif"];
export const allowedVideoTypes = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
];

export function isMobileDevice() {
  const hasTouchScreen = window.matchMedia("(pointer: coarse)").matches;

  const isSmallScreen = window.screen.width <= 768;
  const userAgent = navigator.userAgent;
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];
  const hasMobileUA = toMatch.some((toMatchItem) => {
    return userAgent.match(toMatchItem);
  });
  return hasTouchScreen || (hasMobileUA && isSmallScreen);
}

export function formatVideoTime(seconds: number) {
  const totalSeconds = Math.floor(Math.abs(seconds)); // Handle potential negative input
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  } else {
    return `${pad(mins)}:${pad(secs)}`;
  }
}

export function objShallowEqual(
  obj1: Record<string, any> | undefined,
  obj2: Record<string, any> | undefined,
): boolean {
  if (!obj1 || !obj2) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => obj1[key] === obj2[key]);
}
export const showNotification = (
  title: string,
  options: NotificationOptions,
) => {
  if (!document.hidden || Notification.permission !== "granted") return;
  try {
    new Notification(title, options);
  } catch (err) {
    console.warn("Failed to show notification:", err);
  }
};

export const getNotificationsPermission = async () => {
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission === "default") {
    return await Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        return true;
      } else {
        return false;
      }
    });
  }
  return false;
};
