import React from "react";
import {useAccount, useEnsName} from "wagmi";
import Image from "next/image";
import FrameRenderer from "./FrameRenderer";
import {hasWebLink, removeWebLink} from "../lib/utils";
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

  const {data: ensName} = useEnsName({
    address: nameOrAddress as `0x${string}`,
  });

  const checkSelf = () => {
    return nameOrAddress.toLowerCase() === address?.toLowerCase();
  };

  return (
    <div
      className={`chat flex flex-col px-2 ${
        checkSelf() ? "chat-end" : "chat-start"
      }`}
    >
      <p>
        {checkSelf()
          ? "You"
          : ensName ??
            `${nameOrAddress!.slice(0, 6) + "..." + nameOrAddress!.slice(-4)}`}
      </p>
      <div
        className={`chat-bubble bg-gray-500 max-w-lg ${
          hasWebLink(message) ? "p-0" : "px-4 py-2"
        }`}
      >
        {hasWebLink(message) ? (
          <div className="flex flex-col gap-2">
            <FrameRenderer URL={message} />
            <p>{removeWebLink(message)}</p>
          </div>
        ) : (
          message
        )}
      </div>{" "}
      <span className="text-xs ml-2 justify-end">
        {new Date(Number(ts)).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};

export default ChatMessage;
