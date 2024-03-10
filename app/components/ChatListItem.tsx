import Image from "next/image";
import React from "react";
import {useEnsName} from "wagmi";
import {useCurrentChat} from "../contexts/currentChatContext";
import {isAddress} from "viem";
interface ChatListItemProps {
  icon?: string;
  nameOrAddress: `0x${string}` | string;
  chatId: string;
  lastMessage?: string;
  lastSentOrReceivedTS?: number;
  focus?: boolean;
}
const ChatListItem: React.FC<ChatListItemProps> = ({
  icon,
  nameOrAddress,
  chatId,
  lastMessage,
  lastSentOrReceivedTS,
  focus,
}) => {
  const {setActiveChat} = useCurrentChat();
  const {data: ensName} = useEnsName({
    address: nameOrAddress as `0x${string}`,
  });

  const getTimeFormatted = () => {
    if (!lastSentOrReceivedTS) return;
    const date = new Date(lastSentOrReceivedTS);
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
    return `${date.getDate().toString().padStart(2, "0")}/${date
      .getMonth()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const onChatItemClick = () => {
    console.log("Setting active chat", chatId);
    setActiveChat({chatId, nameOrAddress, icon, ensName});
  };

  return (
    <div
      className={`w-full flex flex-row gap-2 overflow-x-hidden hover:bg-gray-400 hover:rounded-lg  py-2 px-2 border-b-2 border-[gray] cursor-pointer relative ${
        focus && `bg-gray-400 rounded-lg`
      }`}
      onClick={onChatItemClick}
    >
      <div className="avatar">
        <div className="w-12 rounded-full">
          <Image
            src={icon ? icon : "/chatIconPlaceholder.png"}
            alt="userIcon"
            height={12}
            width={12}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between pr-4">
        <div className="flex flex-col justify-center text-nowrap text-ellipsis">
          <p className="font-extrabold text-lg text">
            {ensName
              ? ensName
              : isAddress(nameOrAddress)
              ? `${
                  nameOrAddress!.slice(0, 6) + "..." + nameOrAddress!.slice(-4)
                }`
              : nameOrAddress}
          </p>
          <p className="truncate text-ellipsis text-sm">{lastMessage}</p>
        </div>
        <div className="absolute top-25 right-2">
          {lastSentOrReceivedTS && (
            <p className="text-sm">{getTimeFormatted()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
