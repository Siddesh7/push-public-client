import React, {useEffect, useRef, useState} from "react";
import {useCurrentChat} from "../contexts/currentChatContext";
import {CONSTANTS, IFeeds, chat} from "@pushprotocol/restapi";
import {useUserAlice} from "../contexts/userAliceContext";
import ChatMessage from "./ChatMessage";
import RequestOrInviteAcceptForm from "./RequestOrInviteAcceptForm";

const ChatMessages = () => {
  const {userAlice, userStream} = useUserAlice();
  const {activeChat} = useCurrentChat();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const startMessageRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchChatMessages = async (self?: boolean) => {
    if (!activeChat.chatId) return;

    if (!self) setLoading(true);

    const chatHistory = await userAlice.chat.history(activeChat.chatId, {
      limit: 30,
    });

    setChatMessages(chatHistory.reverse());
    if (!self) setLoading(false);
  };

  const fetchOldMessages = async (chatMessages: any[]) => {
    const scrollTop = startMessageRef.current?.scrollTop || 0;
    if (scrollTop === 0) {
      console.log("Reached the top of the scrollable area");

      const oldMessages = await userAlice.chat.history(activeChat.chatId, {
        limit: 15,
        reference: chatMessages[0].link,
      });

      const allMessages = oldMessages.reverse().concat(chatMessages);
      console.log("allMessages", allMessages);
      // setChatMessages(allMessages);
      // setChatMessages((prev) => [...prev, ...oldMessages.reverse()]);
    }
  };
  useEffect(() => {
    fetchChatMessages();
  }, [activeChat.chatId]);

  if (userStream) {
    userStream?.on(CONSTANTS.STREAM.CHAT, (data: any) => {
      if (data.event === "chat.message") {
        if (data.chatId !== activeChat.chatId) return;
        fetchChatMessages(true);
      }
    });
  }

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({behavior: "smooth"});
  }, []);

  useEffect(() => {
    if (chatMessages.length === 0) return;
    startMessageRef.current?.addEventListener("scroll", () => {
      fetchOldMessages(chatMessages);
    });

    return () => {
      startMessageRef.current?.removeEventListener("scroll", () => {
        fetchOldMessages(chatMessages);
      });
    };
  }, [chatMessages]);

  return (
    <div
      className="max-h-[82vh] min-h-[82vh] w-full flex-grow overflow-y-scroll no-scrollbar pb-4 px-8"
      ref={startMessageRef}
    >
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
                    nameOrAddress={chat?.fromDID?.slice(7)}
                  />
                </div>
              ) : (
                <div key={index}>
                  <ChatMessage
                    message={chat.messageContent}
                    ts={chat.timestamp}
                    nameOrAddress={chat?.fromDID?.slice(7)}
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
