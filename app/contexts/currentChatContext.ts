import {createContext, useContext} from "react";
import {GetEnsNameReturnType} from "wagmi/actions";
export type ActiveChat = {
  chatId: string;
  nameOrAddress?: `0x${string}` | string;
  icon?: string;
  ensName?: GetEnsNameReturnType;
  chatOrGroup?: "CHAT" | "GROUP";
  chatList: "CHATS" | "REQUESTS";
  search?: string;
  resolvedAddress?: any;
};
export interface CurrentChat {
  activeChat: ActiveChat;
  setActiveChat: (chat: ActiveChat) => void;
}

const initialChat: CurrentChat = {
  activeChat: {
    chatId: "",
    nameOrAddress: "" as `0x${string}`,
    icon: "",
    ensName: "",
    chatOrGroup: "CHAT",
    chatList: "CHATS",
    search: "",
    resolvedAddress: "",
  },
  setActiveChat: () => {},
};

export const CurrentChatContext = createContext(initialChat);

export const useCurrentChat = () => {
  const context = useContext(CurrentChatContext);
  if (!context) {
    throw new Error("useCurrentChat must be used within a CurrentChatProvider");
  }
  return context;
};
