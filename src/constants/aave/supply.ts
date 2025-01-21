import { ChainId } from "@aave/contract-helpers";
import * as pools from "@bgd-labs/aave-address-book";

export const chainIdAaveModuleMap = {
  [ChainId.mainnet]: pools.AaveV3Ethereum,
  [ChainId.polygon]: pools.AaveV3Polygon,
  [ChainId.arbitrum_one]: pools.AaveV3Arbitrum,
  [ChainId.optimism]: pools.AaveV3Optimism,
  [ChainId.avalanche]: pools.AaveV3Avalanche,
  [ChainId.base]: pools.AaveV3Base,
  [ChainId.sepolia]: pools.AaveV3Sepolia,
} as Record<
  number,
  | typeof pools.AaveV3Ethereum
  | typeof pools.AaveV3Polygon
  | typeof pools.AaveV3Arbitrum
  | typeof pools.AaveV3Optimism
  | typeof pools.AaveV3Avalanche
  | typeof pools.AaveV3Base
  | typeof pools.AaveV3Metis
  | typeof pools.AaveV3Sepolia
>;
