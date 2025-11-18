import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
  deleteMessage: (messageId: string) => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsTyping: (conversationId: string, isTyping: boolean) => void;
  addReaction: (messageId: string, userId: string, react: ReactType) => void;
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

      deleteMessage: (messageId: string) =>
        set(
          produce((state: State & Actions) => {
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            if (messageIndex > -1) {
              state.currentConversationMessages.splice(messageIndex, 1);
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
      addReaction: (messageId: string, userId: string, react: ReactType) =>
        set(
          produce((state: State & Actions) => {
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            console.log({ messageIndex });
            if (messageIndex <= -1) return;
            const reactIndex = state.currentConversationMessages[
              messageIndex
            ].reacts.findIndex((r) => r.user._id === userId);
            console.log({ reactIndex });
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
            console.log({ conversationIndex });
            if (conversationIndex > -1) {
              state.conversations[conversationIndex].lastMessage = lastMessage;
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

    { name: "ChatDataStore" },
  ),
);
