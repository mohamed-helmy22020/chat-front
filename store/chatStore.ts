import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type State = {
  search: string;
  searchList: InstructorType[];
  instructorsList: InstructorType[];
  conversations: ConversationType[];
  currentConversation: ConversationType | null;
  currentConversationMessages: MessageType[];
  isConnected: boolean;
  isSending: boolean;
};

type Actions = {
  changeSearch: (search: string) => void;
  changeInstructorsList: (instructorList: InstructorType[]) => void;
  changeConversations: (conversations: ConversationType[]) => void;
  changeCurrentConversation: (conversation: ConversationType | null) => void;
  addConversation: (conversation: ConversationType) => void;
  changeCurrentConversationMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType, conversation: ConversationType) => void;
  changeIsConnected: (isConnected: boolean) => void;
  changeIsSending: (isSending: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  search: "",
  searchList: [],
  instructorsList: [],
  conversations: [],
  currentConversation: null,
  currentConversationMessages: [],
  isConnected: false,
  isSending: false,
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
              const searchList = state.instructorsList.filter((i) =>
                i.name.includes(search),
              );
              state.searchList = searchList;
            }),
          ),
        changeInstructorsList: (instructorList: InstructorType[]) =>
          set(
            produce((state: State & Actions) => {
              state.instructorsList = instructorList;
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

        changeIsSending: (isSending: boolean) =>
          set(
            produce((state: State & Actions) => {
              state.isSending = isSending;
            }),
          ),
        reset: () => set(initialState),
      }),
      //options

      {
        name: "ChatDataStore",
        onRehydrateStorage: (state) => {
          console.log("hydration starts");

          return (state, error) => {
            if (error) {
              console.log("an error happened during hydration", error);
            } else {
              console.log("hydration finished");
            }
          };
        },
      },
    ),
    { name: "ChatDataStore" },
  ),
);
