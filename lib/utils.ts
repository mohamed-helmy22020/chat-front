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
    "No course with this id": "NoCourseWithId",
    "No lecture with this id": "NoLectureWithId",
    "No note with this id": "NoNoteWithId",
    "You can change only your courses": "ChangeOnlyYourCourses",
    "Please provide valid course id": "ProvideValidCourseId",
    "Please provide valid lecture id": "ProvideValidLectureId",
    "Please provide valid note id": "ProvideValidNoteId",
    "Course not found": "CourseNotFound",
    "Instructor not found": "InstructorNotFound",
    "You've already bought this course": "AlreadyBought",
    "This is coupon is expired": "CouponExpired",
    "This coupon has reached the users limit": "CouponReachedLimit",
    "This email is used": "EmailIsUsed",
    "This phone is used": "PhoneIsUsed",
    "Email is already verified": "EmailAlreadyVerified",
    "Invalid verification code": "InvalidVerificationCode",
    "You can add only one note for the same video second":
      "OnlyOneNoteForSameVideoSeconds",
    "You can only edit your notes": "EditOnlyYourNotes",
    "You can only delete your notes": "DeleteOnlyYourNotes",
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
export function formatDateToStatus(dateString: string) {
  const inputDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to 00:00:00 to compare dates only
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
    return inputDate.toLocaleDateString();
  }

  // Format time: 6:06 AM (no seconds, with AM/PM)
  const timeStr = inputDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${label}, ${timeStr}`;
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
