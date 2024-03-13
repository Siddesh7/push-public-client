"use client";
import React, {useEffect, useState} from "react";
import {useWalletClient} from "wagmi";
import {useUserAlice} from "../contexts/userAliceContext";
import {IFeeds, PushAPI} from "@pushprotocol/restapi";
import ChatListItem from "./ChatListItem";

interface IChatList {
  type: "CHATS" | "REQUESTS";
}
const ChatList: React.FC<IChatList> = ({type}) => {
  const [chatList, setChatList] = useState<IFeeds[]>([]);
  const {userAlice} = useUserAlice();
  const {data: signer} = useWalletClient();
  const fetchChatList = async () => {
    if (!signer) return;
    const chatListResponse = await userAlice?.chat?.list(type, {limit: 20});

    setChatList(chatListResponse);
  };

  useEffect(() => {
    fetchChatList();
  }, [userAlice, signer]);
  return (
    <div className="h-screen min-w-[400px] overflow-y-scroll no-scrollbar border-y-2 border-[gray]">
      {chatList &&
        chatList.length > 0 &&
        chatList.map((chat, index) => {
          if (!chat.chatId && !chat.msg && !chat.profilePicture) null;

          if (chat.groupInformation) {
          }
          return (
            <ChatListItem
              key={index}
              icon={
                chat.groupInformation
                  ? chat.groupInformation.groupImage!
                  : chat.profilePicture!
              }
              chatId={chat.chatId!}
              nameOrAddress={
                chat.groupInformation
                  ? (chat.groupInformation.groupName as any)
                  : (chat.did.slice(7) as `0x${string}`)
              }
              lastSentOrReceivedTS={chat.msg.timestamp!}
              lastMessage={chat.msg.messageContent}
              chatOrGroup={chat.groupInformation ? "GROUP" : "CHAT"}
              focus={false}
            />
          );
        })}
    </div>
  );
};

export default ChatList;
