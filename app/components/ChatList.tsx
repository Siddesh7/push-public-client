"use client";
import React, {useEffect, useState} from "react";
import {useWalletClient} from "wagmi";
import {useUserAlice} from "../contexts/userAliceContext";
import {CONSTANTS, IFeeds, PushAPI} from "@pushprotocol/restapi";
import ChatListItem from "./ChatListItem";
import {useCurrentChat} from "../contexts/currentChatContext";
import {isAddress} from "viem";

interface IChatList {
  type: "CHATS" | "REQUESTS";
}
const ChatList: React.FC<IChatList> = ({type}) => {
  const [chatList, setChatList] = useState<any[]>([]);
  const {userAlice, userStream} = useUserAlice();
  const {data: signer} = useWalletClient();
  const {activeChat} = useCurrentChat();
  const fetchChatList = async () => {
    if (!signer) return;
    const chatListResponse = await userAlice?.chat?.list(type, {limit: 20});
    setChatList(chatListResponse);
  };

  useEffect(() => {
    fetchChatList();
  }, [userAlice, signer]);

  if (userStream) {
    userStream?.on(CONSTANTS.STREAM.CHAT, (data: any) => {
      if (data.event === "chat.message") {
        fetchChatList();
      }
    });
    userStream?.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
    
      fetchChatList();
    });
  }

  return (
    <div className="h-[78vh] min-w-[400px] overflow-y-scroll no-scrollbar border-[gray]">
      {isAddress(activeChat.resolvedAddress!) ||
      isAddress(activeChat.search!) ? (
        <ChatListItem
          key={"search"}
          chatId={activeChat.resolvedAddress!}
          nameOrAddress={activeChat.resolvedAddress}
          chatOrGroup={"CHAT"}
          focus={false}
          chatList={"CHATS"}
        />
      ) : (
        <div></div>
      )}
      {!isAddress(activeChat.resolvedAddress!) &&
        !isAddress(activeChat.search!) &&
        chatList &&
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
              chatList={type}
            />
          );
        })}
    </div>
  );
};

export default ChatList;
