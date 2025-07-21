import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    console.log({ error });
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
