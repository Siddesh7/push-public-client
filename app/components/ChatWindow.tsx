import React, {useState} from "react";
import ChatSendComponent from "./ChatSendComponent";
import ChatInfo from "./ChatInfo";
import ChatMessages from "./ChatMessages";
import {useCurrentChat} from "../contexts/currentChatContext";
import {useUserAlice} from "../contexts/userAliceContext";
import {CONSTANTS} from "@pushprotocol/restapi";
import IncomingCallCard from "./IncomingCallCard";

const ChatWindow = () => {
  const {activeChat} = useCurrentChat();
  const {userAlice, userStream} = useUserAlice();
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<any>({});
  if (userStream) {
    userStream.on(CONSTANTS.STREAM.VIDEO, (data: any) => {
      console.log("Incoming video call", data);
      if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
        console.log("Incoming video call", data);
        setShowIncomingCall(true);
        setIncomingCallData(data);
      }
    });
  }
  return (
    <div className="min-h-full max-h-screen w-full">
      {activeChat.chatId && (
        <div>
          {" "}
          <ChatInfo onShowSearch={() => {}} />
          <div className="flex flex-col min-h-[92vh] max-h-[92vh] justify-between">
            <div className="flex-grow overflow-y-scroll no-scrollbar">
              <ChatMessages />
            </div>
            <div className="flex justify-end">
              <ChatSendComponent />
            </div>
          </div>
          {showIncomingCall && <IncomingCallCard callData={incomingCallData} />}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
