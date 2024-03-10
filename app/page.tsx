"use client";
import Image from "next/image";
import ThemeControllerButton from "./components/ThemeControllerButton";
import {useTheme} from "./contexts/themeContext";
import Landing from "./components/Landing";
import {useAccount, useWalletClient} from "wagmi";

import {UserContext} from "./contexts/userAliceContext";
import {useEffect, useState} from "react";

import {CONSTANTS, PushAPI, TYPES} from "@pushprotocol/restapi";
import ChatList from "./components/ChatList";

import {ActiveChat, CurrentChatContext} from "./contexts/currentChatContext";
import ChatWindow from "./components/ChatWindow";
export default function Home() {
  const [userAlice, setUserAlice] = useState<PushAPI>({} as PushAPI);
  const [userStream, setUserStream] = useState<any>();
  const [userAliceVideo, setUserAliceVideo] = useState<any>();
  const [userAliceVideoData, setUserAliceVideoData] =
    useState<TYPES.VIDEO.DATA>(CONSTANTS.VIDEO.INITIAL_DATA);
  const [activeChat, setActiveChat] = useState<ActiveChat>({} as ActiveChat);
  const {theme} = useTheme();
  const {isConnected, address} = useAccount();
  const {data: signer} = useWalletClient();
  const [loading, setLoading] = useState(true);
  const initializeUser = async () => {
    const user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });

    const stream = await user.initStream([
      CONSTANTS.STREAM.CHAT,
      CONSTANTS.STREAM.CHAT_OPS,
      CONSTANTS.STREAM.VIDEO,
    ]);

    await stream.connect();

    setUserAlice(user);
    setUserStream(stream);

    console.log("User logged in as", address);
  };

  useEffect(() => {
    if (!signer) return;
    initializeUser();
    setLoading(false);
    return () => {
      userStream?.disconnect();
    };
  }, [signer]);
  return (
    <main
      className="min-h-screen max-h-screen overflow-y-hidden bg-base-200"
      data-theme={theme}
    >
      {!isConnected ? (
        <>
          <nav className="flex flex-row justify-between px-8 py-8">
            <Image
              src={
                theme === "garden"
                  ? "/push_logo_dark.png"
                  : "/push_logo_light.png"
              }
              alt="Vercel Logo"
              width={100}
              height={72}
            />
            <ThemeControllerButton />
          </nav>
          <Landing />
        </>
      ) : (
        <UserContext.Provider
          value={{
            userAlice,
            setUserAlice,
            userStream,
            setUserStream,
            userAliceVideo,
            setUserAliceVideo,
            userAliceVideoData,
            setUserAliceVideoData,
          }}
        >
          <CurrentChatContext.Provider value={{activeChat, setActiveChat}}>
            {loading ? (
              <div className="flex flex-row min-h-screen justify-center items-center">
                <span className="loading loading-ring loading-xs"></span>
                <span className="loading loading-ring loading-sm"></span>
                <span className="loading loading-ring loading-md"></span>
                <span className="loading loading-ring loading-lg"></span>
              </div>
            ) : (
              <div className="flex flex-row">
                <div className="w-[400px]">
                  <ChatList />
                </div>
                <div className="w-full">
                  <ChatWindow />
                </div>
              </div>
            )}
          </CurrentChatContext.Provider>
        </UserContext.Provider>
      )}
    </main>
  );
}
