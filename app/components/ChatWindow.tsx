import React, {useEffect, useRef, useState} from "react";
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
    <div className="min-h-full max-h-screen w-full overflow-y-hidden px-1">
      {activeChat.chatId && (
        <div className="flex flex-col items-center min-h-full">
          <div className="h-[8vh] w-full">
            <ChatInfo onShowSearch={() => {}} />
          </div>
          <ChatMessages />

          <div className="h-[7vh] w-full">
            <ChatSendComponent />
          </div>
        </div>
      )}
      {/* {showIncomingCall && <IncomingCallCard callData={incomingCallData} />} */}
    </div>
  );
};

export default ChatWindow;
