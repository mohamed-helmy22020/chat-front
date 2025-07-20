"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchWithErrorHandling } from "../utils";

export const signUp = async (userData: SignUpDataType) => {
  const cookieStore = await cookies();

  try {
    const response = await fetchWithErrorHandling("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    cookieStore.set("accessToken", response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return {
      success: true,
      data: response.user,
    };
  } catch (error: any) {
    cookieStore.set("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return {
      success: false,
      error: {
        msg: error.message || error.msg,
      },
    };
  }
};

export const signIn = async (userData: SignInDataType) => {
  const cookieStore = await cookies();
  try {
    const response = await fetchWithErrorHandling("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell the server it's JSON
      },
      body: JSON.stringify(userData),
    });

    cookieStore.set("accessToken", response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return {
      success: true,
      data: response.user,
    };
  } catch (error: any) {
    console.log(error);
    cookieStore.set("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return {
      success: false,
      error: {
        msg: error.message || error.msg,
      },
    };
  }
};

export const sendResetCode = async (email: string) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    const res = await fetchWithErrorHandling("/auth/send-reset-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell the server it's JSON
      },
      body: JSON.stringify({ email }),
    });
    return res;
  } catch (error: any) {
    return {
      success: false,
      error: {
        msg: error.message || error.msg,
      },
    };
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  password: string,
) => {
  try {
    if (!email || !password || !code) {
      throw new Error("Email, password and code are required");
    }
    if (code.length != 6) throw new Error("Code must be 6 characters long");
    if (isNaN(Number(code))) throw new Error("Code must be a number");
    if (password.length < 10)
      throw new Error("Password must be at least 10 characters long");

    const res = await fetchWithErrorHandling("/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell the server it's JSON
      },
      body: JSON.stringify({ email, code, newPassword: password }),
    });
    return res;
  } catch (error: any) {
    return {
      success: false,
      error: {
        msg: error.message || error.msg,
      },
    };
  }
};

export const getUserData = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const userData = await fetchWithErrorHandling("/user/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      userData: {
        ...userData.user,
        accessToken,
      },
    };
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const logOut = async () => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  redirect("/");
};

export const getFriendsList = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling("/user/friends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const findUser = async (email: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/user/find/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};
