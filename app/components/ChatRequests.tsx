import React, {useEffect, useState} from "react";
import {MdMarkChatUnread} from "react-icons/md";
import {useUserAlice} from "../contexts/userAliceContext";
import {useWalletClient} from "wagmi";
import {IoMdArrowRoundBack} from "react-icons/io";
import ChatList from "./ChatList";

const ChatRequests = () => {
  const {userAlice} = useUserAlice();
  const {data: signer} = useWalletClient();

  const [chatRequestsCount, setChatRequestsCount] = useState<number>(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const fetchChatRequests = async () => {
    const chats = await userAlice?.chat?.list("REQUESTS", {limit: 30});
    setChatRequestsCount(chats?.length);
  };

  useEffect(() => {
    if (userAlice && signer) fetchChatRequests();
  }, [userAlice, signer]);
  return (
    <div className="drawer z-[3]">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={showDrawer}
      />
      <div className={`drawer-content`}>
        <label
          htmlFor="my-drawer"
          className={`w-full drawer-button flex flex-row item-center gap-2 px-4 my-1 overflow-x-hidden hover:bg-white/20 hover:bg-opacity-25 hover:rounded-xl   py-4 cursor-pointer relative`}
          onClick={() => {
            setShowDrawer(true);
          }}
        >
          <div className="flex justify-center items-center px-2">
            <MdMarkChatUnread size={"22px"} />
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-primary">Chat Requests</p>
            <p>{chatRequestsCount}</p>
          </div>
        </label>
      </div>
      <div
        className={`drawer-side w-[420px] max-h-screen overflow-y-hidden z-0 ${
          !showDrawer && "hidden"
        }`}
      >
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className=" bg-black z-[4]"
        ></label>
        <div className="py-4 min-w-[420px] max-w-[420px] gap-4 min-h-full bg-base-200 text-base-content man-h-screen overflow-y-hidden no-scrollbar flex flex-col">
          <div
            className="flex px-2"
            onClick={() => {
              setShowDrawer(false);
            }}
          >
            <IoMdArrowRoundBack size={"22px"} />
          </div>

          <ChatList type="REQUESTS" />
        </div>
      </div>
    </div>
  );
};

export default ChatRequests;
