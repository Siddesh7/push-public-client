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
  const [chatList, setChatList] = useState<IFeeds[]>([]);
  const {userAlice, userStream} = useUserAlice();
  const {data: signer} = useWalletClient();
  // const {activeChat} = useCurrentChat();

  // const [searchList, setSearchList] = useState<any>({} as IFeeds);
  const fetchChatList = async () => {
    if (!signer) return;
    const chatListResponse = await userAlice?.chat?.list(type, {limit: 20});
    setChatList(chatListResponse);
  };

  useEffect(() => {
    fetchChatList();
  }, [userAlice, signer]);

  // useEffect(() => {
  //   console.log(activeChat);
  //   if (chatList.length === 0) return;
  //   setSearchList(undefined);
  //   if (isAddress(activeChat.resolvedAddress)) {
  //     const isResolvedAddressInChatList = chatList.find(
  //       (chat) => chat?.did?.slice(7) === activeChat.resolvedAddress
  //     );
  //     setSearchList(isResolvedAddressInChatList);
  //   } else if (isAddress(activeChat.search!)) {
  //     const isSearchInChatList = chatList.find(
  //       (chat) => chat?.did?.slice(7) === activeChat.search!
  //     );
  //     setSearchList(isSearchInChatList);
  //   }
  //   console.log("searchList", searchList);
  // }, [activeChat.search, activeChat.resolvedAddress, chatList]);

  if (userStream) {
    userStream?.on(CONSTANTS.STREAM.CHAT, (data: any) => {
      if (data.event === "chat.message") {
        fetchChatList();
      }
    });
    userStream?.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
      console.log("data", data);
      fetchChatList();
    });
  }
  return (
    <div className="h-[84vh] min-w-[400px] overflow-y-scroll no-scrollbar border-y-2 border-[gray]">
      {/* {isAddress(searchList?.did) ? (
        <ChatListItem
          icon={
            searchList.groupInformation
              ? searchList.groupInformation.groupImage!
              : searchList.profilePicture!
          }
          chatId={searchList.chatId!}
          nameOrAddress={
            searchList.groupInformation
              ? (searchList.groupInformation.groupName as any)
              : (searchList.did.slice(7) as `0x${string}`)
          }
          lastSentOrReceivedTS={searchList.msg.timestamp!}
          lastMessage={searchList.msg.messageContent}
          chatOrGroup={searchList.groupInformation ? "GROUP" : "CHAT"}
          focus={false}
        />
      ) : (
        <div>
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
      )}

      {searchList === undefined && (
        <ChatListItem
          chatId={"undefined"}
          nameOrAddress={
            isAddress(activeChat.search!)
              ? activeChat.search!
              : activeChat.resolvedAddress!
          }
          chatOrGroup={"CHAT"}
          focus={false}
        />
      )} */}

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
              chatList={type}
            />
          );
        })}
    </div>
  );
};

export default ChatList;
