import * as pools from "@bgd-labs/aave-address-book";

export const chainIdAaveModuleMap: Record<number, typeof pools.AaveV3Ethereum> =
  Object.values(pools).reduce((acc, aaveChainModule) => {
    return {
      ...acc,
      [aaveChainModule.CHAIN_ID]: aaveChainModule,
    };
  }, {});
