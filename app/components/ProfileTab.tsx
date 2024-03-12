"use client";
import React, {useEffect, useState} from "react";
import {useAccount, useEnsName, useWalletClient} from "wagmi";
import {useUserAlice} from "../contexts/userAliceContext";
import Image from "next/image";
import {UserInfo} from "../lib/types";
import {truncateAddress} from "../lib/utils";
import {BsThreeDotsVertical} from "react-icons/bs";

const ProfileTab = () => {
  const {userAlice} = useUserAlice();
  const {address} = useAccount();
  const {data: signer} = useWalletClient();
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const {data: ensName} = useEnsName({
    address: userInfo.address as `0x${string}`,
  });
  const fetchUserInfo = async () => {
    if (!address || !userAlice || !signer) return;
    const userInfo = await userAlice?.info();

    const user = {
      name: userInfo.profile.name ?? "",
      profilePicture: userInfo.profile.picture || "",
      address: userInfo.did.slice(7) || address!,
    };

    setUserInfo(user);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [userAlice, address]);

  return (
    <div className="flex flex-row items-center w-full gap-4 py-2 px-4  bg-white/20 bg-opacity-25 rounded-xl">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full">
          <Image
            src={
              userInfo.profilePicture
                ? userInfo.profilePicture
                : "/chatIconPlaceholder.png"
            }
            alt="userIcon"
            height={10}
            width={10}
            className="rounded-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        <p>{ensName ?? truncateAddress(userInfo.address)}</p>
        <div className="flex flex-row items-center gap-2">
          <div className="dropdown dropdown-end">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
