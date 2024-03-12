"use client";
import Image from "next/image";
import React, {useState, useEffect} from "react";
import {useAccount} from "wagmi";
import {FrameDetails, getFormattedMetadata, getHostname} from "../lib/utils";
import Link from "next/link";
import {useUserAlice} from "../contexts/userAliceContext";

function FrameRenderer({URL}: {URL: string}): React.ReactElement {
  const {userAlice} = useUserAlice();
  const {address} = useAccount();
  const [metaTags, setMetaTags] = useState<FrameDetails>({
    image: "",
    siteURL: "",
    postURL: "",
    buttons: [],
    input: {name: "", content: ""},
  });
  const [inputText, setInputText] = useState("");
  useEffect(() => {
    const fetchMetaTags = async (url: string) => {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const frameDetails: FrameDetails = getFormattedMetadata(URL, html);
        setMetaTags(frameDetails);
      } catch (err) {
        console.error("Error fetching meta tags:", err);
      }
    };

    if (URL) {
      fetchMetaTags(URL);
    }
  }, [URL]);

  const subscribeToChannel = async (channel: string) => {
    const response = await userAlice?.notification.subscribe(
      `eip155:11155111:${channel}`
    );
    return true;
  };
  const onButtonClick = async (button: {
    index: string;
    action?: string;
    target?: string;
  }) => {
    if (button.action === "post_redirect" || button.action === "link") {
      window.location.href = button.target!;
      return;
    }
    if (button.action === "subscribe") {
      await subscribeToChannel(button.target!);
    }
    const response = await fetch("/api/frames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buttonIndex: Number(button.index),
        inputText: inputText,
        userAddress: address,
        postURL: button?.target!.startsWith("http")
          ? button.target
          : metaTags.postURL,
      }),
    });
    const data = await response.json();
    const frameDetails: FrameDetails = getFormattedMetadata(URL, data.data);
    setInputText("");
    setMetaTags(frameDetails);
  };
  return (
    <div className="w-full h-full">
      {metaTags.image && (
        <div className="size-84 flex flex-col gap-2 justify-center border-1 rounded-t-xl bg-white">
          <Link href={URL} target="blank">
            <Image
              src={metaTags.image}
              alt="Meta Image"
              width={1528}
              height={800}
              className="rounded-t-xl"
            />
          </Link>
          {metaTags?.input?.name && metaTags?.input?.content.length > 0 && (
            <div className="w-[95%] m-auto">
              <input
                type="text"
                className="input w-full"
                placeholder={metaTags.input!.content}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          )}
          <div className="flex flex-row justify-between gap-2 items-center w-[95%] m-auto">
            {metaTags.buttons.map((button) => (
              <button
                key={button.index}
                className={`btn btn-primary flex-shrink-0`} // Ensure buttons don't shrink
                style={{width: `${100 / metaTags.buttons.length - 1}%`}} // Set dynamic width
                onClick={(e) => {
                  e.preventDefault();
                  onButtonClick(button);
                }}
              >
                {button.content} {}
              </button>
            ))}
          </div>
          <div className="flex justify-end mr-4 mb-2">
            <a
              href={`https://${getHostname(URL)}`}
              target="blank"
              className="text-black/60 text"
            >
              {getHostname(URL)}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default FrameRenderer;
