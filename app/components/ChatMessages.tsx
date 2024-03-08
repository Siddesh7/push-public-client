import React, {useEffect, useRef, useState} from "react";
import {useCurrentChat} from "../contexts/currentChatContext";
import {CONSTANTS, IFeeds} from "@pushprotocol/restapi";
import {useUserAlice} from "../contexts/userAliceContext";
import ChatMessage from "./ChatMessage";

const ChatMessages = () => {
  const {userAlice, userStream} = useUserAlice();
  const {activeChat} = useCurrentChat();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const fetchChatMessages = async () => {
    if (!activeChat.chatId) return;

    const chatHistory = await userAlice.chat.history(activeChat.chatId, {
      limit: 30,
    });
    setChatMessages(chatHistory.reverse());
  };
  useEffect(() => {
    console.log("fetching chat messages");
    fetchChatMessages();
  }, [activeChat.chatId]);

  if (userStream) {
    userStream?.on(CONSTANTS.STREAM.CHAT, (data: any) => {
      if (data.event === "chat.message") {
        if (data.chatId !== activeChat.chatId) return;

        fetchChatMessages();
      }
    });
  }

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({behavior: "smooth"});
  }, [chatMessages]);

  return (
    <div className="py-2 pb-16 px-8 ">
      {chatMessages &&
        chatMessages.length > 0 &&
        chatMessages.map((chat, index) => {
          return (
            <ChatMessage
              key={index}
              message={chat.messageContent}
              ts={chat.timestamp}
              nameOrAddress={chat.fromDID.slice(7)}
            />
          );
        })}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatMessages;
