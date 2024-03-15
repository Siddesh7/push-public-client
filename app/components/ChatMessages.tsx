import React, {useEffect, useRef, useState} from "react";
import {useCurrentChat} from "../contexts/currentChatContext";
import {CONSTANTS, IFeeds} from "@pushprotocol/restapi";
import {useUserAlice} from "../contexts/userAliceContext";
import ChatMessage from "./ChatMessage";
import RequestOrInviteAcceptForm from "./RequestOrInviteAcceptForm";

const ChatMessages = () => {
  const {userAlice, userStream} = useUserAlice();
  const {activeChat} = useCurrentChat();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchChatMessages = async () => {
    if (!activeChat.chatId) return;

    setLoading(true);

    const chatHistory = await userAlice.chat.history(activeChat.chatId, {
      limit: 30,
    });
    setChatMessages(chatHistory.reverse());
    setLoading(false);
  };
  useEffect(() => {
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
      {!loading &&
        chatMessages &&
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

      {activeChat.chatList === "REQUESTS" && <RequestOrInviteAcceptForm />}
    </div>
  );
};

export default ChatMessages;
