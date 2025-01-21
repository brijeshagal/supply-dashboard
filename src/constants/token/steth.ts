import { TokenDetails } from "@/types/token/details";
import { ChainId } from "@aave/contract-helpers";

export const stethTokenDetails: Record<number, TokenDetails> = {
  [ChainId.mainnet]: {
    symbol: "stETH",
    name: "Staked Ether",
    decimals: 18,
    chainId: ChainId.mainnet,
    address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
  },
} as Record<number, TokenDetails>;
