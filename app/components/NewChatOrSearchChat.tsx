import React, {useEffect} from "react";
import {ActiveChat, useCurrentChat} from "../contexts/currentChatContext";
import {useEnsAddress} from "wagmi";
import {normalize} from "path";
import {resolveName} from "../lib/utils";

const NewChatOrSearchChat = () => {
  const {setActiveChat, activeChat} = useCurrentChat();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveChat({...activeChat, search: e.target.value});
  };

  const resolve = async () => {
    if (activeChat.search) {
      setActiveChat({
        ...activeChat,
        resolvedAddress: await resolveName(activeChat.search),
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (activeChat.search) {
        const resolved = await resolveName(activeChat.search);
        setActiveChat({
          ...activeChat,
          resolvedAddress: resolved,
        });
      }
    };

    fetchData();
  }, [activeChat.search]);

  return (
    <div className="w-[95%] m-auto pb-2">
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          placeholder="Search or start a new chat"
          onChange={handleChange}
          className="grow"
          value={activeChat.search}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70 cursor-pointer"
          onClick={resolve}
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
    </div>
  );
};

export default NewChatOrSearchChat;
