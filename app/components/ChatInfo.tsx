import React, {useRef, useState} from "react";
import Image from "next/image";
import {FaSearch} from "react-icons/fa";
import {BsThreeDotsVertical} from "react-icons/bs";
import {useCurrentChat} from "../contexts/currentChatContext";
import {IoCallSharp} from "react-icons/io5";
import {IoIosVideocam} from "react-icons/io";
import {useUserAlice} from "../contexts/userAliceContext";
import {CONSTANTS, TYPES} from "@pushprotocol/restapi";

interface ChatInfoProps {
  onShowSearch?: () => void;
}
const ChatInfo: React.FC<ChatInfoProps> = ({onShowSearch}) => {
  const {activeChat} = useCurrentChat();
  const {userAlice, userStream, setUserAliceVideo, setUserAliceVideoData} =
    useUserAlice();

  console.log("activeChat", activeChat);
  const InitiateCall = async (type: string) => {
    console.log("Initiating call", type);
    if (!activeChat.nameOrAddress) return;
    const userAliceVideo = await userAlice.video.initialize(
      setUserAliceVideoData,
      {
        stream: userStream,
        config: {
          video: type === "video",
          audio: true,
        },
      }
    );
    setUserAliceVideo(userAliceVideo);
    await userAliceVideo?.request([activeChat.nameOrAddress]);
  };
  return (
    <div className="flex flex-row w-full gap-4 py-2 px-4">
      <div className="avatar">
        <div className="w-14 rounded-full">
          <Image
            src={activeChat.icon ? activeChat.icon : "/chatIconPlaceholder.png"}
            alt="userIcon"
            height={12}
            width={12}
          />
        </div>
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        <p>{activeChat.ensName ?? activeChat.nameOrAddress}</p>
        <div className="flex flex-row items-center gap-4">
          <IoCallSharp
            size={"20px"}
            onClick={() => {
              InitiateCall("audio");
            }}
          />
          <IoIosVideocam
            size={"20px"}
            onClick={() => {
              InitiateCall("video");
            }}
          />

          <FaSearch onClick={onShowSearch} />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
              <BsThreeDotsVertical />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
