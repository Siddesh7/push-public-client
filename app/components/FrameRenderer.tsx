"use client";
import Image from "next/image";
import React, {useState, useEffect} from "react";
import {useAccount} from "wagmi";
import {getHostname} from "../lib/utils";

interface FrameDetails {
  image: string;
  siteURL: string;
  postURL: string;
  buttons: {index: string; content: string; action?: string; target?: string}[];
  input?: {name: string; content: string};
}
function FrameRenderer({URL}: {URL: string}): React.ReactElement {
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
      const frameDetails: FrameDetails = {
        image: "",
        siteURL: URL,
        postURL: "",
        buttons: [],
        input: {name: "", content: ""},
      };
      try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const metaElements = doc.head.querySelectorAll("meta");

        metaElements.forEach((element, index) => {
          const name =
            element.getAttribute("name") || element.getAttribute("property");
          const content = element.getAttribute("content");

          if (name && content) {
            if (name === "fc:frame:image") {
              frameDetails.image = content;
            } else if (name === "fc:frame:post_url") {
              frameDetails.postURL = content;
            } else if (
              name.includes("fc:frame:button") &&
              !name.includes("action") &&
              !name.includes("target")
            ) {
              const index = name.split(":")[3];
              const indexZeroExists = frameDetails.buttons.some(
                (button) => button.index === index
              );
              if (!indexZeroExists) {
                frameDetails.buttons.push({
                  index: index,
                  content: content,
                  action: "",
                  target: "",
                });
              } else {
                const indexToUpdate = frameDetails.buttons.findIndex(
                  (button) => button.index === String(index)
                );
                frameDetails.buttons[indexToUpdate].content = content;
                frameDetails.buttons[indexToUpdate].index = index;
              }
            } else if (name === "fc:frame:input:text") {
              frameDetails.input = {name, content};
            } else if (
              name.includes("fc:frame:button:") &&
              name.includes(":action")
            ) {
              const number = name.split(":")[3];
              const indexZeroExists = frameDetails.buttons.some(
                (button) => button.index === number
              );
              if (!indexZeroExists) {
                frameDetails.buttons.push({
                  index: number,
                  content: "",
                  action: content,
                  target: "",
                });
              } else {
                const indexToUpdate = frameDetails.buttons.findIndex(
                  (button) => button.index === number
                );
                frameDetails.buttons[indexToUpdate].action = content;
              }
            } else if (
              name.includes("fc:frame:button:") &&
              name.includes(":target")
            ) {
              const number = name.split(":")[3];

              const indexZeroExists = frameDetails.buttons.some(
                (button) => button.index === number
              );
              if (!indexZeroExists) {
                frameDetails.buttons.push({
                  index: number,
                  content: "",
                  action: "",
                  target: content,
                });
              } else {
                const indexToUpdate = frameDetails.buttons.findIndex(
                  (button) => button.index === number
                );
                frameDetails.buttons[indexToUpdate].target = content;
              }
            }
          }
        });
        console.log(frameDetails);
        setMetaTags(frameDetails);
      } catch (err) {
        console.error("Error fetching meta tags:", err);
      }
    };

    if (URL) {
      fetchMetaTags(URL);
    }
  }, [URL]);

  const onButtonClick = async (button: {
    index: string;
    action?: string;
    target?: string;
  }) => {
    console.log("Button clicked:", button);
    if (button.action === "post_redirect" || button.action === "link") {
      window.location.href = button.target!;
      return;
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

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.data, "text/html");

    const metaElements = doc.head.querySelectorAll("meta");

    const frameDetails: FrameDetails = {
      image: "",
      siteURL: URL,
      postURL: "",
      buttons: [],
      input: {name: "", content: ""},
    };
    console.log(frameDetails);
    metaElements.forEach((element, index) => {
      const name =
        element.getAttribute("name") || element.getAttribute("property");
      const content = element.getAttribute("content");

      if (name && content) {
        if (name === "fc:frame:image") {
          frameDetails.image = content;
        } else if (name === "fc:frame:post_url") {
          frameDetails.postURL = content;
        } else if (
          name.includes("fc:frame:button") &&
          !name.includes("action") &&
          !name.includes("target")
        ) {
          const index = name.split(":")[3];
          const indexZeroExists = frameDetails.buttons.some(
            (button) => button.index === index
          );
          if (!indexZeroExists) {
            frameDetails.buttons.push({
              index: index,
              content: content,
              action: "",
              target: "",
            });
          } else {
            const indexToUpdate = frameDetails.buttons.findIndex(
              (button) => button.index === String(index)
            );
            frameDetails.buttons[indexToUpdate].content = content;
            frameDetails.buttons[indexToUpdate].index = index;
          }
        } else if (name === "fc:frame:input:text") {
          frameDetails.input = {name, content};
        } else if (
          name.includes("fc:frame:button:") &&
          name.includes(":action")
        ) {
          const number = name.split(":")[3];
          const indexZeroExists = frameDetails.buttons.some(
            (button) => button.index === number
          );
          if (!indexZeroExists) {
            frameDetails.buttons.push({
              index: number,
              content: "",
              action: content,
              target: "",
            });
          } else {
            const indexToUpdate = frameDetails.buttons.findIndex(
              (button) => button.index === number
            );
            frameDetails.buttons[indexToUpdate].action = content;
          }
        } else if (
          name.includes("fc:frame:button:") &&
          name.includes(":target")
        ) {
          const number = name.split(":")[3];

          const indexZeroExists = frameDetails.buttons.some(
            (button) => button.index === number
          );
          console.log("Index zero exists:", indexZeroExists);
          if (!indexZeroExists) {
            frameDetails.buttons.push({
              index: number,
              content: "",
              action: "",
              target: content,
            });
          } else {
            const indexToUpdate = frameDetails.buttons.findIndex(
              (button) => button.index === number
            );

            console.log("Index to update:", indexToUpdate);
            frameDetails.buttons[indexToUpdate].target = content;
          }
        }
      }
    });
    setInputText("");

    setMetaTags(frameDetails);
  };
  return (
    <div className="w-full">
      {metaTags.image && (
        <div className="size-84 flex flex-col gap-2 justify-center border-1 rounded-t-xl bg-white mb-2">
          <Image
            src={metaTags.image}
            alt="Meta Image"
            width={1528}
            height={800}
            className="rounded-t-xl"
          />
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
          <div className="flex justify-end mr-4 mb-4">
            <a
              href={`https://${getHostname(URL)}`}
              target="blank"
              className="text-black/80 text"
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
