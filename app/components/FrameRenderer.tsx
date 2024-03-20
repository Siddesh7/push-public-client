"use client";
import Image from "next/image";
import React, {useState, useEffect} from "react";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import {
  FrameDetails,
  getFormattedMetadata,
  getHostname,
  isSupportedChain,
} from "../lib/utils";
import Link from "next/link";
import {useUserAlice} from "../contexts/userAliceContext";
import {BsLightning} from "react-icons/bs";

import {FaBell} from "react-icons/fa";

function FrameRenderer({URL}: {URL: string}): React.ReactElement {
  const {userAlice} = useUserAlice();
  const {address} = useAccount();
  const {sendTransactionAsync} = useSendTransaction();
  const {switchChain} = useSwitchChain();
  const chainId = useChainId();
  const {writeContractAsync} = useWriteContract();

  const [metaTags, setMetaTags] = useState<FrameDetails>({
    image: "",
    siteURL: "",
    postURL: "",
    buttons: [],
    input: {name: "", content: ""},
  });
  const [inputText, setInputText] = useState("");

  // Fetches the metadata for the URL to fetch the Frame
  useEffect(() => {
    const fetchMetaTags = async (url: string) => {
      try {
        const response = await fetch(`/api/frames?url=${url}`, {method: "GET"});
        const res = await response.json();
        const frameDetails: FrameDetails = getFormattedMetadata(URL, res);

        setMetaTags(frameDetails);
      } catch (err) {
        console.error("Error fetching meta tags:", err);
      }
    };

    if (URL) {
      fetchMetaTags(URL);
    }
  }, [URL]);

  // Function to subscribe to a channel
  const subscribeToChannel = async (channel: string, desiredChain: any) => {
    if (chainId !== Number(desiredChain)) {
      switchChain({
        chainId: Number(desiredChain),
      });
    }
    try {
      const response = await userAlice.notification.subscribe(
        `eip155:${desiredChain}:${channel}`
      );
      if (response.status == 204)
        return {status: "success", message: "Subscribed"};
      else return {status: "failure", message: "Something went wrong"};
    } catch (error) {
      return {status: "failure", message: "Something went wrong"};
    }
  };

  // Function to trigger a transaction
  const TriggerTx = async (data: any) => {
    if (chainId !== Number(data.chainId.slice(7))) {
      switchChain({
        chainId: Number(data.chainId.slice(7)),
      });
    }
    let hash;
    try {
      hash = await sendTransactionAsync({
        account: address,
        chainId: Number(data.chainId.slice(7)),
        to: data.params.to as `0x${string}`,
        value: data.params.value,
        data: (data.params.data as any) ?? undefined,
      });
    } catch (error) {
      return {status: "failure", message: "Something went wrong"};
    }

    return {hash, status: "success", message: "Transaction sent"};
  };
  // const mintNFT = async (address: string) => {
  //   const [, desiredChainId, contractAddress] = address.split(":");

  //   try {
  //     if (chainId !== Number(desiredChainId)) {
  //       switchChain({
  //         chainId: Number(desiredChainId),
  //       });
  //     }
  //     if (chainId === Number(desiredChainId)) {
  //       const response = await writeContractAsync({
  //         abi: [
  //           {
  //             inputs: [],
  //             name: "safeMint",
  //             outputs: [],
  //             stateMutability: "nonpayable",
  //             type: "function",
  //           },
  //         ],
  //         address: contractAddress as `0x${string}`,
  //         functionName: "safeMint",
  //         args: [],
  //       });
  //       console.log("Minting NFT:", response);
  //       return true;
  //     }
  //   } catch (error) {
  //     return false;
  //   }

  //   return false;
  // };

  const mintNFT = async (address: string) => {
    const [, desiredChainId, contractAddress] = address.split(":");

    try {
      await switchChain({chainId: Number(desiredChainId)});

      const response = await writeContractAsync({
        abi: [
          {
            inputs: [],
            name: "safeMint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        address: contractAddress as `0x${string}`,
        functionName: "safeMint",
        args: [],
      });
      console.log("Minting NFT:", response);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Function to handle button click on a frame button
  const onButtonClick = async (button: {
    index: string;
    action?: string;
    target?: string;
  }) => {
    let hash;
    let SubscribeStatus = null;

    // If the button action is post_redirect or link, opens the link in a new tab
    if (button.action === "post_redirect" || button.action === "link") {
      window.open(button.target!, "_blank");
      return;
    }

    // If the button action is subscribe, subscribes to the channel and then makes a POST call to the Frame server
    if (button.action?.includes("subscribe")) {
      const desiredChainId = button.action?.split(":")[1];
      if (isSupportedChain(Number(desiredChainId))) {
        const res = await subscribeToChannel(button.target!, desiredChainId);
        if (res.status === "success") {
          SubscribeStatus = "Subscribed";
        } else {
          SubscribeStatus = res.message;

          return;
        }
      } else {
        SubscribeStatus = "error";
        alert("Testnet channels are not supported");
        return;
      }
    }

    // If the button action is tx, triggers a transaction and then makes a POST call to the Frame server
    if (button.action === "tx") {
      const response = await fetch("/api/frames/tx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buttonIndex: Number(button.index),
          userAddress: address,
          inputText: inputText,
          postURL: button?.target!.startsWith("http")
            ? button.target
            : metaTags.postURL,
        }),
      });
      const data = await response.json();
      const {hash: txid, status} = await TriggerTx(data);
      hash = txid;
      if (!txid || status === "failure") return;
    }

    // If the button action is mint, mints an NFT and then makes a POST call to the Frame server
    if (button.action === "mint") {
      try {
        const res = await mintNFT(button.target!);

        if (!res) return;
      } catch (error) {
        console.error("Error minting NFT:", error);
        return;
      }
    }

    // Makes a POST call to the Frame server after the action has been performed
    const response = await fetch("/api/frames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buttonIndex: Number(button.index),
        inputText: inputText,
        userAddress: address,
        transactionId: hash ?? "Failed",
        postURL:
          button.action === "tx"
            ? metaTags.postURL
            : button?.target!.startsWith("http")
            ? button.target
            : metaTags.postURL,
        status: SubscribeStatus,
        state: metaTags.state,
      }),
    });
    const data = await response.json();
    const frameDetails: FrameDetails = getFormattedMetadata(URL, data.data);
    setInputText("");

    setMetaTags(frameDetails);
  };
  return (
    <div className={`w-full h-full ${!metaTags.image && "pt-2"}`}>
      {metaTags.image ? (
        <div className="max-w-lg size-84 flex flex-col gap-2 justify-center border-1 rounded-t-xl bg-white">
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
                {button.content} {button.action === "tx" && <BsLightning />}{" "}
                {button.action === "link" && "🔗"}
                {button.action === "post_redirect" && "🔗"}
                {button.action?.includes("subscribe") && <FaBell />}
                {button.action === "mint" && "💰"}
              </button>
            ))}
          </div>
          <div className="flex justify-end mr-4 mb-2">
            <a href={URL} target="blank" className="text-black/60 text">
              {getHostname(URL)}
            </a>
          </div>
        </div>
      ) : (
        <div className="max-w-[100%] truncate">
          {" "}
          <a href={URL} target="blank" className="px-4 link truncate">
            {URL}
          </a>
        </div>
      )}
    </div>
  );
}

export default FrameRenderer;
