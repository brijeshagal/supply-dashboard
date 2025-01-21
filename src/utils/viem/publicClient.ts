import PublicClientProvider from "@/client/PublicClientProvider";
import { Abi, Address } from "viem";

export const getPublicClient = (chainId: number) => {
  return PublicClientProvider.getPublicClient(chainId);
};

export const multicall = async ({
  chainId,
  contracts,
}: {
  chainId: number;
  contracts: {
    address: Address;
    abi: Abi;
    functionName: string;
    args: unknown[];
  }[];
}) => {
  const publicClient = getPublicClient(chainId);
  return publicClient.multicall({
    contracts,
  });
};
