import React from "react";
import {useAccount, useEnsName} from "wagmi";
import Image from "next/image";
interface ChatMessageProps {
  nameOrAddress: string;
  ts: number;
  message: any;
  key: number;
}
const ChatMessage: React.FC<ChatMessageProps> = ({
  nameOrAddress,
  ts,
  message,
  key,
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
      className={`chat flex flex-col ${
        checkSelf() ? "chat-end" : "chat-start"
      }`}
      key={key}
    >
      <p>
        {checkSelf()
          ? "You"
          : ensName ??
            `${nameOrAddress!.slice(0, 6) + "..." + nameOrAddress!.slice(-4)}`}
      </p>
      <div className="chat-bubble bg-gray-500">
        {message.startsWith("{") || message.startsWith("https") ? (
          <Image src={message.content} height={100} width={100} alt="dd" />
        ) : (
          message
        )}
        <span className="text-xs ml-2">
          {new Date(Number(ts)).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
