import React, {useEffect} from "react";
import {useUserAlice} from "../contexts/userAliceContext";
import {useEnsName} from "wagmi";
import {truncateAddress} from "../lib/utils";
interface IncomingCallCardProps {
  callData: any;
}

const IncomingCallCard: React.FC<IncomingCallCardProps> = ({callData}) => {
  const {setUserAliceVideo, userStream, userAlice, setUserAliceVideoData} =
    useUserAlice();
  const {data: ensName} = useEnsName({
    address: callData?.peerInfo?.address as `0x${string}`,
  });

  const initialiaseVideoInstance = async () => {
    setUserAliceVideo(
      await userAlice?.video.initialize(setUserAliceVideoData, {
        stream: userStream,
        config: {
          video: true,
          audio: true,
        },
      })
    );
  };

  useEffect(() => {
    initialiaseVideoInstance();
  }, []);
  return (
    <div className="min-w-full min-h-full flex justify-center items-center">
      <div className="card w-96 bg-primary text-primary-content">
        <div className="card-body">
          <h2 className="card-title">Incoming Call</h2>
          <p>
            {ensName ??
              truncateAddress(callData?.peerInfo?.address.slice(7) as string)}
            is calling...
          </p>
          <div className="card-actions flex justify-center gap-4">
            <button className="btn btn-success">Accept</button>
            <button className="btn btn-error">Deny</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallCard;
