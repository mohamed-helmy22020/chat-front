import { chatSocket } from "@/src/socket";
import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useUserStore } from "./userStore";
const user = useUserStore.getState().user;
export interface callStateType {
  isCalling: boolean;
  isIncomingCall: boolean;
  isInCall: boolean;
  callType: "voice" | "video" | null;
  caller: MiniUserType | null;
  callee: MiniUserType | null;
  callId: string;
  callState: CallStateType;

  call: (callType: "voice" | "video", callee: MiniUserType) => void;
  endCall: () => void;
  incomingCall: (
    caller: MiniUserType,
    callId: string,
    callType: "voice" | "video",
  ) => void;
  changeIsCalling: (isCalling: boolean) => void;
  changeIsIncomingCall: (isIncomingCall: boolean) => void;
  changeIsInCall: (isInCall: boolean) => void;
  changeCallType: (callType: "voice" | "video" | null) => void;
  changeCaller: (caller: participant) => void;
  changeCallee: (callee: participant) => void;
  changeCallId: (callId: string) => void;
  changeCallState: (callState: CallStateType | null) => void;
  resetCall: () => void;
}

export const useCallStore = create<callStateType>()(
  devtools(
    (set) => ({
      isCalling: false,
      isIncomingCall: false,
      isInCall: false,
      callType: null,
      caller: null,
      callee: null,
      callId: "",
      callState: null,
      call: (callType: "voice" | "video", callee: MiniUserType) =>
        set(
          produce((state: callStateType) => {
            state.isCalling = true;
            state.callType = callType;
            state.callee = callee;
            state.caller = user!;
            state.callState = "Waiting";
          }),
        ),
      incomingCall: (
        caller: MiniUserType,
        callId: string,
        callType: "voice" | "video",
      ) =>
        set(
          produce((state: callStateType) => {
            state.isIncomingCall = true;
            state.callState = "Waiting";
            state.callType = callType;
            state.caller = caller;
            state.callee = user!;
            state.callId = callId;
          }),
        ),
      endCall: () =>
        set(
          produce((state: callStateType) => {
            const otherSide =
              state.caller?._id !== user?._id ? state.caller : state.callee;
            chatSocket.emit("endCall", otherSide?._id, state.callId);
            state.isCalling = false;
            state.isIncomingCall = false;
            state.isInCall = false;
            state.callType = null;
            state.caller = null;
            state.callee = null;
            state.callId = "";
            state.callState = null;
          }),
        ),
      changeIsCalling: (isCalling: boolean) =>
        set(
          produce((state: callStateType) => {
            state.isCalling = isCalling;
          }),
        ),
      changeIsIncomingCall: (isIncomingCall: boolean) =>
        set(
          produce((state: callStateType) => {
            state.isIncomingCall = isIncomingCall;
          }),
        ),
      changeIsInCall: (isInCall: boolean) =>
        set(
          produce((state: callStateType) => {
            state.isInCall = isInCall;
          }),
        ),
      changeCallType: (callType: "voice" | "video" | null) =>
        set(
          produce((state: callStateType) => {
            state.callType = callType;
          }),
        ),
      changeCaller: (caller: MiniUserType) =>
        set(
          produce((state: callStateType) => {
            state.caller = caller;
          }),
        ),
      changeCallee: (callee: MiniUserType) =>
        set(
          produce((state: callStateType) => {
            state.callee = callee;
          }),
        ),
      changeCallId: (callId: string) =>
        set(
          produce((state: callStateType) => {
            state.callId = callId;
          }),
        ),
      changeCallState: (callState: CallStateType) =>
        set(
          produce((state: callStateType) => {
            state.callState = callState;
          }),
        ),
      resetCall: () =>
        set(
          produce((state: callStateType) => {
            state.isCalling = false;
            state.isIncomingCall = false;
            state.isInCall = false;
            state.callType = null;
            state.caller = null;
            state.callee = null;
            state.callId = "";
            state.callState = null;
          }),
        ),
    }),

    { name: "CallStore" },
  ),
);
