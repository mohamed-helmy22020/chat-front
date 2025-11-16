import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type State = {
  search: string;
  conversations: ConversationType[];
  currentConversation: ConversationType | null;
  currentConversationMessages: MessageType[];
  isConnected: boolean;
};

type Actions = {
  changeSearch: (search: string) => void;
  changeConversations: (conversations: ConversationType[]) => void;
  changeCurrentConversation: (conversation: ConversationType | null) => void;
  addConversation: (conversation: ConversationType) => void;
  changeCurrentConversationMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType, conversation: ConversationType) => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsTyping: (conversationId: string, isTyping: boolean) => void;
  changeLastMessage: (
    conversation: ConversationType,
    lastMessage: MessageType,
  ) => void;
  reset: () => void;
};

const initialState: State = {
  search: "",
  conversations: [],
  currentConversation: null,
  currentConversationMessages: [],
  isConnected: false,
};
export const useChatStore = create<State & Actions>()(
  devtools(
    persist(
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
              state.currentConversationMessages = messages;
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
                state.conversations[conversationIndex].lastMessage =
                  conversation.lastMessage;
              } else {
                state.conversations.push(conversation);
              }
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
        changeLastMessage: (
          conversation: ConversationType,
          lastMessage: MessageType,
        ) =>
          set(
            produce((state: State & Actions) => {
              const conversationIndex = state.conversations.findIndex(
                (c) => c.id === conversation.id,
              );
              console.log({ conversationIndex });
              if (conversationIndex > -1) {
                state.conversations[conversationIndex].lastMessage =
                  lastMessage;
              } else {
                state.conversations.push({
                  ...conversation,
                });
              }
            }),
          ),
        reset: () => set(initialState),
      }),
      //options

      {
        name: "ChatDataStore",
        onRehydrateStorage: () => {
          console.log("hydration starts");

          return (state, error) => {
            if (error) {
              console.log("an error happened during hydration", error);
            } else {
              console.log("hydration finished");
              if (state?.currentConversation) {
                state.currentConversation = null;
              }
            }
          };
        },
      },
    ),
    { name: "ChatDataStore" },
  ),
);
