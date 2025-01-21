import { createWalletClient, custom } from "viem";
import { viemChainsById } from "./chains";

export const getWalletClient = (chainId: number) => {
  return createWalletClient({
    transport: custom(window.ethereum),
    chain: viemChainsById[chainId],
  });
};
