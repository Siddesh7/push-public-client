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

  const InitiateCall = async (type: string) => {
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
    <div className="flex flex-row items-center w-full gap-4 py-2 px-4  bg-white/20 bg-opacity-25 rounded-xl">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          <Image
            src={activeChat.icon ? activeChat.icon : "/chatIconPlaceholder.png"}
            alt="userIcon"
            height={10}
            width={10}
            className="rounded-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        <p className="text-primary font-bold text-lg">
          {activeChat.ensName ?? activeChat.nameOrAddress}
        </p>
        <div className="flex flex-row items-center">
          {/* <div className="btn bg-transparent border-0 hover:bg-white/20">
            <IoCallSharp
              size={"20px"}
              onClick={() => {
                InitiateCall("audio");
              }}
            />
          </div>{" "} */}
          <div className="btn bg-transparent border-0 hover:bg-white/20">
            <IoIosVideocam
              size={"20px"}
              onClick={() => {
                alert("Video is WIP");
                // InitiateCall("video");
              }}
            />
          </div>
          {/* <div className="btn bg-transparent border-0 hover:bg-white/20">
            <FaSearch onClick={onShowSearch} />
          </div> */}
          {/* <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-transparent border-0 hover:bg-white/20"
            >
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
