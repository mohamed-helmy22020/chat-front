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
  allMessages: Record<string, MessageType[]>;
  isConnected: boolean;
  isForwardingMessage: boolean;
  forwardMessage: MessageType | null;
  isInviting: boolean;
  inviteGroup: ConversationType | null;
  replyMessage: MessageType | null;
  infoItem: MessageType | ConversationType | null;
};

const initialState: State = {
  search: "",
  conversations: [],
  currentConversation: null,
  currentSelectedMediaMessage: null,
  currentConversationMessages: [],
  allMessages: {},
  isConnected: false,
  isForwardingMessage: false,
  forwardMessage: null,
  isInviting: false,
  inviteGroup: null,
  replyMessage: null,
  infoItem: null,
};

type Actions = {
  changeSearch: (search: string) => void;
  changeConversations: (conversations: ConversationType[]) => void;
  deleteConversation: (
    conversationId: string,
    type?: "delete" | "exit",
  ) => void;
  changeCurrentConversation: (conversation: ConversationType | null) => void;
  addConversation: (conversation: ConversationType) => void;
  changeCurrentConversationMessages: (messages: MessageType[]) => void;
  changeForwardMessage: (message: MessageType | null) => void;
  changeInviteGroup: (group: ConversationType | null) => void;
  addMoreMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType, conversation: ConversationType) => void;
  updateMessage: (messageId: string, message: MessageType) => void;
  deleteMessage: (messageId: string, conversationId?: string) => void;
  seeAllMessages: () => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsTyping: (conversationId: string, isTyping: boolean) => void;
  addReaction: (
    messageId: string,
    conversationId: string,
    userId: string,
    react: ReactType,
  ) => void;
  changeCurrentSelectedMediaMessage: (message: MessageType | null) => void;
  changeLastMessage: (
    conversation: ConversationType,
    lastMessage: MessageType,
  ) => void;
  changeReplyMessage: (message: MessageType | null) => void;
  addGroupParticipant: (group: ConversationType, newUser: participant) => void;
  removeGroupParticipant: (groupId: string, userId: string) => void;
  changeInfoItem: (infoItem: ConversationType | MessageType | null) => void;
  updateGroupSettings: (
    groupId: string,
    groupSettings: GroupSettingsType,
  ) => void;
  resetChats: () => void;
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
      deleteConversation: (
        conversationId: string,
        type: "delete" | "exit" = "delete",
      ) =>
        set(
          produce((state: State & Actions) => {
            if (type === "exit") {
              state.conversations = state.conversations.filter(
                (c) => c.id !== conversationId,
              );
            } else {
              state.conversations = state.conversations.map((c) => {
                if (c.id === conversationId) {
                  return { ...c, lastMessage: null };
                }
                return c;
              });
            }
            delete state.allMessages[conversationId];
          }),
        ),

      changeCurrentConversation: (conversation: ConversationType | null) =>
        set(
          produce((state: State & Actions) => {
            if (state.currentConversation?.id === conversation?.id) {
              return;
            }
            state.replyMessage = null;
            state.infoItem = null;
            if (conversation) {
              state.currentConversationMessages =
                state.allMessages[conversation.id] || [];
            } else {
              state.currentConversationMessages = [];
            }
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
            if (!state.currentConversation) return;
            const sortedMessages = messages.sort((a, b) => {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            });
            state.currentConversationMessages = sortedMessages;
            state.allMessages[state.currentConversation.id] = sortedMessages;
          }),
        ),
      changeForwardMessage: (message: MessageType | null) =>
        set(
          produce((state: State & Actions) => {
            state.forwardMessage = message;
            state.isForwardingMessage = !!message;
          }),
        ),

      changeInviteGroup: (group: ConversationType | null) =>
        set(
          produce((state: State & Actions) => {
            state.inviteGroup = group;
            state.isInviting = !!group;
          }),
        ),
      addMoreMessages: (messages: MessageType[]) =>
        set(
          produce((state: State & Actions) => {
            if (!state.currentConversation) return;
            const sortedMessages = [
              ...messages,
              ...state.currentConversationMessages,
            ].sort((a, b) => {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            });
            state.currentConversationMessages = sortedMessages;
            state.allMessages[state.currentConversation.id] = sortedMessages;
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
                ...conversation.lastMessage!,
                seen:
                  state.currentConversation?.id === conversation.id
                    ? true
                    : message.seen,
              };
            } else {
              state.conversations.push(conversation);
            }
            if (state.allMessages[conversation.id]) {
              state.allMessages[conversation.id].push(message);
            } else {
              state.allMessages[conversation.id] = [message];
            }
          }),
        ),
      updateMessage: (messageId: string, message: MessageType) =>
        set(
          produce((state: State & Actions) => {
            if (!state.currentConversation) return;
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            if (messageIndex > -1) {
              state.currentConversationMessages[messageIndex] = message;
              state.allMessages[state.currentConversation.id][messageIndex] =
                message;
            }
          }),
        ),
      deleteMessage: (messageId: string, conversationId?: string) =>
        set(
          produce((state: State & Actions) => {
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            if (messageIndex > -1) {
              state.currentConversationMessages.splice(messageIndex, 1);
            }
            const conversationIndex = state.conversations.findIndex(
              (c) => c.lastMessage?.id === messageId,
            );
            if (conversationIndex > -1) {
              if (state.currentConversationMessages.length > 0) {
                state.conversations[conversationIndex].lastMessage =
                  state.currentConversationMessages[
                    state.currentConversationMessages.length - 1
                  ];
              } else if (state.conversations[conversationIndex].lastMessage) {
                state.conversations[conversationIndex].lastMessage.text = "";
              }
            }
            state.allMessages[
              conversationId || state.currentConversation?.id || ""
            ] = state.allMessages[
              conversationId || state.currentConversation?.id || ""
            ]?.filter((m) => m.id !== messageId);
          }),
        ),
      seeAllMessages: () =>
        set(
          produce((state: State & Actions) => {
            state.currentConversationMessages
              .filter((m) => !m.seen && m.from._id === user?._id)
              .map((m) => {
                m.seen = true;
              });
            state.allMessages[state.currentConversation?.id || ""]
              ?.filter((m) => !m.seen && m.from._id === user?._id)
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
      addReaction: (
        messageId: string,
        conversationId: string,
        userId: string,
        react: ReactType,
      ) =>
        set(
          produce((state: State & Actions) => {
            const messageIndex = state.currentConversationMessages.findIndex(
              (m) => m.id === messageId,
            );
            if (messageIndex <= -1) {
              const cachedMessages = state.allMessages[conversationId];
              const messageIndex = cachedMessages.findIndex(
                (m) => m.id === messageId,
              );
              if (messageIndex <= -1) return;
              const reactIndex = cachedMessages[messageIndex].reacts.findIndex(
                (r) => r.user._id === userId,
              );
              if (reactIndex <= -1) {
                cachedMessages[messageIndex].reacts.push(react);

                return;
              }
              if (
                cachedMessages[messageIndex].reacts[reactIndex].react ===
                react.react
              ) {
                cachedMessages[messageIndex].reacts.splice(reactIndex, 1);
              } else {
                cachedMessages[messageIndex].reacts[reactIndex].react =
                  react.react;
              }
              return;
            }
            const reactIndex = state.currentConversationMessages[
              messageIndex
            ].reacts.findIndex((r) => r.user._id === userId);
            if (reactIndex <= -1) {
              state.currentConversationMessages[messageIndex].reacts.push(
                react,
              );
              state.allMessages[conversationId][messageIndex].reacts.push(
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
              state.allMessages[conversationId][messageIndex].reacts.splice(
                reactIndex,
                1,
              );
            } else {
              state.currentConversationMessages[messageIndex].reacts[
                reactIndex
              ].react = react.react;
              state.allMessages[conversationId][messageIndex].reacts[
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
              (u) => u._id === message.from._id,
            );
            if (!user) return;
            state.currentSelectedMediaMessage = { message, user };
          }),
        ),
      changeReplyMessage: (message: MessageType | null) =>
        set(
          produce((state: State & Actions) => {
            state.replyMessage = message;
          }),
        ),
      addGroupParticipant: (group: ConversationType, newUser: participant) =>
        set(
          produce((state: State & Actions) => {
            if (state.currentConversation?.id === group.id) {
              state.currentConversation.participants.push(newUser);
            }
            const groupIndex = state.conversations.findIndex(
              (g) => g.id === group.id,
            );
            if (groupIndex < 0) {
              state.conversations.push({
                ...group,
                participants: [...group.participants, newUser],
              });
              return;
            }
            state.conversations[groupIndex].participants.push(newUser);
          }),
        ),
      removeGroupParticipant: (groupId: string, userId: string) =>
        set(
          produce((state: State & Actions) => {
            if (state.currentConversation?.id === groupId) {
              state.currentConversation.participants =
                state.currentConversation.participants.filter(
                  (p) => p._id !== userId,
                );
              if (userId === user?._id) {
                state.currentConversation = null;
              }
            }
            const groupIndex = state.conversations.findIndex(
              (g) => g.id === groupId,
            );
            if (groupIndex < 0) {
              return;
            }
            if (userId === user?._id) {
              state.conversations = state.conversations.filter(
                (c) => c.id !== groupId,
              );
              return;
            }
            state.conversations[groupIndex].participants = state.conversations[
              groupIndex
            ].participants.filter((p) => p._id !== userId);
          }),
        ),
      changeInfoItem: (infoItem: MessageType | ConversationType | null) =>
        set(
          produce((state: State & Actions) => {
            state.infoItem = infoItem;
          }),
        ),
      updateGroupSettings: (
        groupId: string,
        settings: Partial<GroupSettingsType>,
      ) =>
        set(
          produce((state: State & Actions) => {
            const groupIndex = state.conversations.findIndex(
              (g) => g.id === groupId,
            );
            if (
              groupIndex < 0 ||
              state.conversations[groupIndex].type !== "group"
            ) {
              return;
            }
            state.conversations[groupIndex].groupSettings = {
              ...state.conversations[groupIndex].groupSettings,
              ...settings,
            };
            if (
              state.currentConversation?.id === groupId &&
              state.currentConversation.type === "group"
            ) {
              state.currentConversation.groupSettings = {
                ...state.currentConversation.groupSettings,
                ...settings,
              };
            }
          }),
        ),

      resetChats: () => set(initialState),
    }),
    //options

    { name: "ChatDataStore" },
  ),
);
