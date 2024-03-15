import React from "react";
import {useUserAlice} from "../contexts/userAliceContext";
import {useCurrentChat} from "../contexts/currentChatContext";

const RequestOrInviteAcceptForm = () => {
  const {userAlice} = useUserAlice();
  const {activeChat, setActiveChat} = useCurrentChat();
  const acceptRequest = async () => {
    try {
      if (activeChat.chatOrGroup === "GROUP") {
        const joinGroup = await userAlice.chat.group.join(activeChat.chatId);

        setActiveChat({...activeChat, chatList: "CHATS"});
      } else {
        const acceptRequest = await userAlice.chat.accept(activeChat.chatId);
        setActiveChat({...activeChat, chatList: "CHATS"});
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  return (
    <>
      {activeChat.chatList === "REQUESTS" && (
        <div className="chat flex flex-col px-2   chat-start">
          <div className="chat-bubble  bg-white/10 bg-opacity-25 ">
            {activeChat.chatOrGroup === "GROUP" ? (
              <p>
                You Received an request to join the group. Accept your invite to
                starting chatting!
              </p>
            ) : (
              <p>
                You Received a chat request from {activeChat.chatId}, accept
                this request to start chatting.
              </p>
            )}

            <button
              className="btn btn-primary mt-2 w-full"
              onClick={acceptRequest}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestOrInviteAcceptForm;
