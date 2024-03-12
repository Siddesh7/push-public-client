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
    console.log("chatHistory", chatHistory);
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

  // useEffect(() => {
  //   endOfMessagesRef.current?.scrollIntoView({behavior: "smooth"});
  // }, [chatMessages]);

  return (
    <div className="max-h-[80vh] min-h-[80vh] w-full flex-grow overflow-y-scroll no-scrollbar pb-16 px-8">
      {chatMessages &&
        chatMessages.length > 0 &&
        chatMessages.map((chat, index) => {
          return (
            <div key={index}>
              {chatMessages && chatMessages?.length - 1 === index ? (
                <div key={index} ref={endOfMessagesRef}>
                  <ChatMessage
                    message={chat.messageContent}
                    ts={chat.timestamp}
                    nameOrAddress={chat.fromDID.slice(7)}
                  />
                </div>
              ) : (
                <div key={index}>
                  <ChatMessage
                    message={chat.messageContent}
                    ts={chat.timestamp}
                    nameOrAddress={chat.fromDID.slice(7)}
                  />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ChatMessages;
