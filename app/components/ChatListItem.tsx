import Image from "next/image";
import React from "react";
import {useEnsName} from "wagmi";
import {useCurrentChat} from "../contexts/currentChatContext";
import {isAddress} from "viem";
import {truncateAddress} from "../lib/utils";
interface ChatListItemProps {
  icon?: string;
  nameOrAddress: `0x${string}` | string;
  chatId: string;
  lastMessage?: string;
  lastSentOrReceivedTS?: number;
  focus?: boolean;
  chatOrGroup: "CHAT" | "GROUP";
}
const ChatListItem: React.FC<ChatListItemProps> = ({
  icon,
  nameOrAddress,
  chatId,
  lastMessage,
  lastSentOrReceivedTS,
  focus,
  chatOrGroup,
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

  // const onChatItemClick = () => {
  //   setActiveChat({
  //     chatId,
  //     nameOrAddress,
  //     icon,
  //     ensName,
  //     chatOrGroup,
  //     search: "",
  //   });
  // };

  return (
    <div
      className={`flex flex-row gap-2 overflow-x-hidden hover:bg-white/20 hover:bg-opacity-25  py-3 items-center px-2 border-b-2 border-[gray] cursor-pointer relative ${
        focus && `bg-gray-400 rounded-lg`
      }`}
    >
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          <Image
            src={icon ? icon : "/chatIconPlaceholder.png"}
            alt="userIcon"
            height={10}
            width={10}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-row justify-between max-w-[70%]  pr-4">
        <div className="flex flex-col justify-center truncate">
          <p className="font-extrabold text-lg text-primary  truncate">
            {ensName
              ? ensName
              : isAddress(nameOrAddress)
              ? truncateAddress(nameOrAddress)
              : nameOrAddress}
          </p>
          <p className="truncate text-sm">{lastMessage}</p>
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
