import React from "react";
import {
  useAccount,
  usePrepareTransactionRequest,
  useSendTransaction,
} from "wagmi";

interface SimulateTxProps {
  data: {
    chainId: string; // e.g., "eip155:1"
    method: string; // e.g., "eth_sendTransaction"
    params: {
      abi: any[];
      data?: string;
      to: string;
      value: any;
    };
  };
}

const SimulateTx: React.FC<SimulateTxProps> = ({data}) => {
  const {address} = useAccount();
  const {
    isLoading,
    error,
    data: simulation,
  } = usePrepareTransactionRequest({
    to: data.params.to as `0x${string}`,
    value: data.params.value,
    data: (data.params.data as any) ?? undefined,
    account: address,
    chainId: Number(data.chainId.slice(7)), // Extract chain ID (assuming format "eip155:<chain ID>")
  });

  const {sendTransactionAsync} = useSendTransaction();

  if (isLoading) return <div>Simulating transaction...</div>;

  if (error) return <div>Simulation error: {error.message}</div>;

  sendTransactionAsync({
    account: address,
    chainId: Number(data.chainId.slice(7)),
    to: data.params.to as `0x${string}`,
    value: data.params.value,
    data: (data.params.data as any) ?? undefined,
  });
  return <div>Transaction simulation complete!</div>;
};

export default SimulateTx;
