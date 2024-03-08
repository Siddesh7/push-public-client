"use client";
import Image from "next/image";
import ThemeControllerButton from "./components/ThemeControllerButton";
import {useTheme} from "./contexts/themeContext";
import Landing from "./components/Landing";
import {useAccount, useWalletClient} from "wagmi";

import {UserContext} from "./contexts/userAliceContext";
import {useEffect, useState} from "react";

import {CONSTANTS, PushAPI} from "@pushprotocol/restapi";
import ChatList from "./components/ChatList";

import {ActiveChat, CurrentChatContext} from "./contexts/currentChatContext";
import ChatWindow from "./components/ChatWindow";
import {PushStream} from "@pushprotocol/restapi/src/lib/pushstream/PushStream";
export default function Home() {
  const [userAlice, setUserAlice] = useState<PushAPI>({} as PushAPI);
  const [userStream, setUserStream] = useState<any>();
  const [activeChat, setActiveChat] = useState<ActiveChat>({} as ActiveChat);
  const {theme} = useTheme();
  const {isConnected, address} = useAccount();
  const {data: signer} = useWalletClient();
  const initializeUser = async () => {
    const user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });

    const stream = await user.initStream([
      CONSTANTS.STREAM.CHAT,
      CONSTANTS.STREAM.CHAT_OPS,
    ]);

    await stream.connect();

    setUserAlice(user);
    setUserStream(stream);
  };

  useEffect(() => {
    if (!signer) return;
    initializeUser();

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
          value={{userAlice, setUserAlice, userStream, setUserStream}}
        >
          <CurrentChatContext.Provider value={{activeChat, setActiveChat}}>
            <div className="flex flex-row">
              <div className="w-[400px]">
                <ChatList />
              </div>
              <div className="w-full">
                <ChatWindow />
              </div>
            </div>
          </CurrentChatContext.Provider>
        </UserContext.Provider>
      )}
    </main>
  );
}
