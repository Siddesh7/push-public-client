import React from "react";
import {useAccount, useEnsName} from "wagmi";
import Image from "next/image";
import FrameRenderer from "./FrameRenderer";
import {
  extractWebLink,
  hasWebLink,
  removeWebLink,
  truncateAddress,
} from "../lib/utils";
import {useCurrentChat} from "../contexts/currentChatContext";
interface ChatMessageProps {
  nameOrAddress: string;
  ts: number;
  message: any;
}
const ChatMessage: React.FC<ChatMessageProps> = ({
  nameOrAddress,
  ts,
  message,
}) => {
  const {address} = useAccount();
  const {activeChat} = useCurrentChat();
  const {data: ensName} = useEnsName({
    address: nameOrAddress as `0x${string}`,
  });

  const checkSelf = () => {
    return nameOrAddress.toLowerCase() === address?.toLowerCase();
  };

  const getTimeFormatted = () => {
    if (!ts) return;
    const date = new Date(ts);
    const today = new Date();

    const isToday =
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear();
    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return `${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} ${date.getDate().toString().padStart(2, "0")}/${date
      .getMonth()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div
      className={`chat flex flex-col px-2  ${
        checkSelf() ? "chat-end" : "chat-start"
      }`}
    >
      {activeChat.chatOrGroup === "GROUP" && (
        <p>{checkSelf() ? "You" : ensName ?? truncateAddress(nameOrAddress)}</p>
      )}
      <div
        className={`chat-bubble flex  bg-white/10 bg-opacity-25 max-w-lg ${
          hasWebLink(message) ? "p-0 pb-2 flex-col" : "px-4 py-2 flex-row gap-2"
        }`}
      >
        <div className="text-white">
          {hasWebLink(message) ? (
            <div className="flex flex-col gap-2">
              <FrameRenderer URL={extractWebLink(message)} />
              <p className="px-4">{removeWebLink(message)}</p>
            </div>
          ) : (
            message
          )}
        </div>
        <div
          className={`text-xs flex ${
            hasWebLink(message)
              ? "justify-end pr-2"
              : "justify-end items-end pl-2"
          }`}
        >
          <span>{getTimeFormatted()}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
