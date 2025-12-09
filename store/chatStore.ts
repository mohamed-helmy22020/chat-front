import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useUserStore } from "./userStore";

const user = useUserStore.getState().user;

type State = {
  search: string;
  conversations: ConversationType[];
  currentConversation: ConversationType | null;
  currentSelectedMediaMessage: {
    message: MessageType;
    user: MiniUserType;
  } | null;
  currentConversationMessages: MessageType[];
  isConnected: boolean;
};

type Actions = {
  changeSearch: (search: string) => void;
  changeConversations: (conversations: ConversationType[]) => void;
  deleteConversation: (conversationId: string) => void;
  changeCurrentConversation: (conversation: ConversationType | null) => void;
  addConversation: (conversation: ConversationType) => void;
  changeCurrentConversationMessages: (messages: MessageType[]) => void;
  addMoreMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType, conversation: ConversationType) => void;
  updateMessage: (messageId: string, message: MessageType) => void;
  deleteMessage: (messageId: string) => void;
  seeAllMessages: () => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsTyping: (conversationId: string, isTyping: boolean) => void;
  addReaction: (messageId: string, userId: string, react: ReactType) => void;
  changeCurrentSelectedMediaMessage: (message: MessageType | null) => void;
  changeLastMessage: (
    conversation: ConversationType,
    lastMessage: MessageType,
  ) => void;
  resetChats: () => void;
};

const initialState: State = {
  search: "",
  conversations: [],
  currentConversation: null,
  currentSelectedMediaMessage: null,
  currentConversationMessages: [],
  isConnected: false,
};
export const useChatStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      changeSearch: (search: string) =>
        set(
          produce((state: State & Actions) => {
            state.search = search;
          }),
        ),

      changeConversations: (conversations: ConversationType[]) =>
        set(
          produce((state: State & Actions) => {
            state.conversations = conversations;
          }),
        ),
      deleteConversation: (conversationId: string) =>
        set(
          produce((state: State & Actions) => {
            state.conversations = state.conversations.filter(
              (c) => c.id !== conversationId,
            );
          }),
        ),

      changeCurrentConversation: (conversation: ConversationType | null) =>
        set(
          produce((state: State & Actions) => {
            state.currentConversation = conversation;
          }),
        ),
      addConversation: (conversation: ConversationType) =>
        set(
          produce((state: State & Actions) => {
            state.conversations.push(conversation);
          }),
        ),
      changeCurrentConversationMessages: (messages: MessageType[]) =>
        set(
          produce((state: State & Actions) => {
            state.currentConversationMessages = messages.sort((a, b) => {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            });
          }),
        ),
      addMoreMessages: (messages: MessageType[]) =>
        set(
          produce((state: State & Actions) => {
            state.currentConversationMessages = [
              ...messages,
              ...state.currentConversationMessages,
            ].sort((a, b) => {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            });
          }),
        ),
      addMessage: (message: MessageType, conversation: ConversationType) =>
        set(
          produce((state: State & Actions) => {
            const currentConversation = state.currentConversation;
            if (currentConversation?.id === conversation.id) {
              state.currentConversationMessages.push(message);
            }
            const conversationIndex = state.conversations.findIndex(
              (c) => c.id === conversation.id,
            );
            if (conversationIndex > -1) {
              state.conversations[conversationIndex].lastMessage = {
                ...conversation.lastMessage,
                seen:
                  state.currentConversation?.id === conversation.id
                    ? true
                    : message.seen,
              };
            } else {
              state.conversations.push(conversation);
            }
          }),
        ),
      updateMessage: (messageId: string, message: MessageType) =>
        set(
          produce((state: State & Actions) => {
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            if (messageIndex > -1) {
              state.currentConversationMessages[messageIndex] = message;
            }
          }),
        ),
      deleteMessage: (messageId: string) =>
        set(
          produce((state: State & Actions) => {
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            if (messageIndex > -1) {
              state.currentConversationMessages.splice(messageIndex, 1);
            }
            const conversationIndex = state.conversations.findIndex(
              (c) => c.lastMessage.id === messageId,
            );
            if (conversationIndex > -1) {
              if (state.currentConversationMessages.length > 0) {
                state.conversations[conversationIndex].lastMessage =
                  state.currentConversationMessages[
                    state.currentConversationMessages.length - 1
                  ];
              } else {
                state.conversations[conversationIndex].lastMessage.text = "";
              }
            }
          }),
        ),
      seeAllMessages: () =>
        set(
          produce((state: State & Actions) => {
            state.currentConversationMessages
              .filter((m) => !m.seen && m.from === user?._id)
              .map((m) => {
                m.seen = true;
              });
          }),
        ),

      changeIsConnected: (isConnected: boolean) =>
        set(
          produce((state: State & Actions) => {
            state.isConnected = isConnected;
          }),
        ),
      changeIsTyping: (conversationId: string, isTyping: boolean) =>
        set(
          produce((state: State & Actions) => {
            const conversationIndex = state.conversations.findIndex(
              (c) => c.id === conversationId,
            );
            if (state.currentConversation?.id === conversationId) {
              state.currentConversation.isTyping = isTyping;
            }
            if (conversationIndex > -1) {
              state.conversations[conversationIndex].isTyping = isTyping;
            }
          }),
        ),
      addReaction: (messageId: string, userId: string, react: ReactType) =>
        set(
          produce((state: State & Actions) => {
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            if (messageIndex <= -1) return;
            const reactIndex = state.currentConversationMessages[
              messageIndex
            ].reacts.findIndex((r) => r.user._id === userId);
            if (reactIndex <= -1) {
              state.currentConversationMessages[messageIndex].reacts.push(
                react,
              );
              return;
            }

            if (
              state.currentConversationMessages[messageIndex].reacts[reactIndex]
                .react === react.react
            ) {
              state.currentConversationMessages[messageIndex].reacts.splice(
                reactIndex,
                1,
              );
            } else {
              state.currentConversationMessages[messageIndex].reacts[
                reactIndex
              ].react = react.react;
            }
          }),
        ),
      changeLastMessage: (
        conversation: ConversationType,
        lastMessage: MessageType,
      ) =>
        set(
          produce((state: State & Actions) => {
            const conversationIndex = state.conversations.findIndex(
              (c) => c.id === conversation.id,
            );
            if (conversationIndex > -1) {
              state.conversations[conversationIndex].lastMessage = lastMessage;
            } else {
              state.conversations.push({
                ...conversation,
              });
            }
          }),
        ),
      changeCurrentSelectedMediaMessage: (message: MessageType) =>
        set(
          produce((state: State & Actions) => {
            if (message === null) {
              state.currentSelectedMediaMessage = null;
              return;
            }
            const user = state.currentConversation?.participants.find(
              (u) => u._id === message.from,
            );
            if (!user) return;
            state.currentSelectedMediaMessage = { message, user };
          }),
        ),

      resetChats: () => set(initialState),
    }),
    //options

    { name: "ChatDataStore" },
  ),
);
