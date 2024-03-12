import React, {useState, useRef, ReactEventHandler, useEffect} from "react";
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {};
  useEffect(() => {
    console.log(inputText);
  }, [inputText]);
  return (
    <div className="w-full px-4 py-2 relative">
      <label className="input input-bordered flex items-center gap-2 ">
        <div className=" cursor-pointer my-2" onClick={toggleEmojiPicker}>
          <BsEmojiGrin size={"20px"} />
        </div>
        <div className=" cursor-pointer mx-2">
          <label htmlFor="fileInput">
            <ImAttachment size={"20px"} />
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileUpload}
            style={{display: "none"}}
          />
        </div>
        {showEmoji && (
          <div className="absolute bottom-[55px] left-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          className="w-full" // Apply your existing class for styling
          placeholder="type a message"
          style={{whiteSpace: "pre-wrap", height: "auto"}} // Update the style attribute
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.shiftKey) {
              event.preventDefault();
              setInputText((prev) => prev + "\n");
            } else if (event.key === "Enter") {
              sendMessage();
            }
          }}
          value={inputText}
        />

        <div className=" cursor-pointer" onClick={sendMessage}>
          <LuSend size={"20px"} />
        </div>
      </label>
    </div>
  );
};

export default ChatSendComponent;
