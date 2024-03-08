import React from "react";
import ChatSendComponent from "./ChatSendComponent";
import ChatInfo from "./ChatInfo";
import ChatMessages from "./ChatMessages";
import {useCurrentChat} from "../contexts/currentChatContext";

const ChatWindow = () => {
  const {activeChat} = useCurrentChat();

  return (
    <div className="min-h-full max-h-screen w-full">
      {activeChat.chatId ? (
        <div>
          {" "}
          <ChatInfo onShowSearch={() => {}} />
          <div className="flex flex-col min-h-[92vh] max-h-[92vh] justify-between">
            <div className="flex-grow overflow-y-scroll no-scrollbar">
              <ChatMessages />
            </div>
            <div className="flex relative justify-end">
              <ChatSendComponent />
            </div>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default ChatWindow;
