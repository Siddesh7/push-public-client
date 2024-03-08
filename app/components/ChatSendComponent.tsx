import React, {useState, useRef, ReactEventHandler} from "react";
import EmojiPicker from "emoji-picker-react";
import {MdEmojiEmotions} from "react-icons/md";
import {BsEmojiGrin} from "react-icons/bs";
import {ImAttachment} from "react-icons/im";
import {LuSend} from "react-icons/lu";
import {useUserAlice} from "../contexts/userAliceContext";
import {useCurrentChat} from "../contexts/currentChatContext";

const ChatSendComponent = () => {
  const {userAlice} = useUserAlice();
  const {activeChat} = useCurrentChat();
  const [showEmoji, setShowEmoji] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleEmojiClick = (e: any) => {
    setInputText((prev) => prev + e.emoji);
    setShowEmoji(!showEmoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };
  const sendMessage = async () => {
    if (!inputText || !activeChat.chatId) return;
    console.log("Sending message", inputText);
    await userAlice.chat.send(activeChat.chatId, {
      content: inputText,
    });
    setInputText("");
  };

  return (
    <div className="absolute bottom-3 w-full px-4 py-2">
      <label className="input flex items-center gap-2 ">
        <div className=" cursor-pointer" onClick={toggleEmojiPicker}>
          <BsEmojiGrin size={"20px"} />
        </div>
        <div className=" cursor-pointer" onClick={toggleEmojiPicker}>
          <ImAttachment size={"20px"} />
        </div>
        {showEmoji && (
          <div className="absolute bottom-[55px] left-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <input
          type="text"
          className="grow"
          placeholder="type a message"
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
          value={inputText}
        />
        <kbd className="kbd kbd-sm">⌘</kbd>
        <div className=" cursor-pointer" onClick={sendMessage}>
          <LuSend size={"20px"} />
        </div>
      </label>
    </div>
  );
};

export default ChatSendComponent;
