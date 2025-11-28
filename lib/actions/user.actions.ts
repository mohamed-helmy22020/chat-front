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
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
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
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
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
        msg: error.msg || error.message,
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

export const getSentRequests = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling("/user/sent-requests", {
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

export const getFriendsRequests = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling("/user/friend-requests", {
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

export const getBlockedList = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling("/user/blocked", {
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

export const sendFriendRequest = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/user/friend/${userId}`, {
      method: "POST",
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

export const acceptFriendRequest = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/user/accept-friend/${userId}`, {
      method: "POST",
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

export const cancelFriendRequest = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(
      `/user/cancel-friend-request/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const deleteFriend = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/user/friend/${userId}`, {
      method: "DELETE",
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

export const blockUser = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/user/block/${userId}`, {
      method: "POST",
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

export const unblockUser = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/user/unblock/${userId}`, {
      method: "POST",
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

export const getUserStatuses = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/status`, {
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

export const getFriendsStatuses = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/status/friends`, {
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

export const addTextStatus = async (text: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const formData = new FormData();
  formData.append("content", text);
  try {
    const res = await fetchWithErrorHandling(`/status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const getAllConversations = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetchWithErrorHandling(`/chat/conversations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { success: true, conversations: res.conversations };
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const getConversationMessages = async (
  userId: string,
  before?: string,
  limit?: number,
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const query = `${before ? `before=${before}` : ""}&limit=${limit || 50}`;

  try {
    const res = await fetchWithErrorHandling(
      `/chat/conversations/messages/${userId}?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const addReaction = async (messageId: string, react: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetchWithErrorHandling(
      `/chat/message/${messageId}/react`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          react,
        }),
      },
    );

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const deleteMessage = async (messageId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetchWithErrorHandling(`/chat/message/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const getUserConversation = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetchWithErrorHandling(
      `/chat/conversations/user/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const deleteConversation = async (conversationId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetchWithErrorHandling(
      `/chat/conversations/${conversationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const deleteStatus = async (statusId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/status/${statusId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};

export const seeStatus = async (statusId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetchWithErrorHandling(`/status/see/${statusId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (error: any) {
    return { success: false, ...error };
  }
};
