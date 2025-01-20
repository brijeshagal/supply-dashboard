import { ChainId } from "@aave/contract-helpers";
import {
  AaveV3Avalanche,
  AaveV3Base,
  AaveV3BNB,
  AaveV3Ethereum,
  AaveV3EthereumEtherFi,
  AaveV3EthereumLido,
  AaveV3Polygon,
  AaveV3Scroll,
} from "@bgd-labs/aave-address-book";

export const marketConfig = {
  avalanchev3: {
    chainId: ChainId.avalanche,
    publicJsonRPCUrl: "https://api.avax.network/ext/bc/C/rpc",
    LENDING_POOL_ADDRESS_PROVIDER: AaveV3Avalanche.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3Avalanche.UI_POOL_DATA_PROVIDER,
    marketName: "proto_avalanche_v3",
  },
  polygonv3: {
    chainId: ChainId.polygon,
    publicJsonRPCUrl: "https://polygon-rpc.com",
    LENDING_POOL_ADDRESS_PROVIDER: AaveV3Polygon.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3Polygon.UI_POOL_DATA_PROVIDER,
    marketName: "proto_polygon_v3",
  },
  ethereumv3: {
    chainId: ChainId.mainnet,
    publicJsonRPCUrl: "https://eth-mainnet.alchemyapi.io/v2/demo",
    LENDING_POOL_ADDRESS_PROVIDER: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
    data: AaveV3Ethereum.POOL,
    marketName: "proto_mainnet_v3",
  },
  base: {
    chainId: ChainId.base,
    publicJsonRPCUrl: "https://base-mainnet.public.blastapi.io",
    LENDING_POOL_ADDRESS_PROVIDER: AaveV3Base.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3Base.UI_POOL_DATA_PROVIDER,
    marketName: "proto_base_v3",
  },
  bnb: {
    chainId: ChainId.bnb,
    publicJsonRPCUrl: "https://bsc-mainnet.public.blastapi.io",
    LENDING_POOL_ADDRESS_PROVIDER: AaveV3BNB.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3BNB.UI_POOL_DATA_PROVIDER,
    marketName: "proto_bnb_v3",
  },
  scroll: {
    chainId: ChainId.scroll,
    publicJsonRPCUrl: "https://scroll-mainnet.public.blastapi.io",
    LENDING_POOL_ADDRESS_PROVIDER: AaveV3Scroll.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3Scroll.UI_POOL_DATA_PROVIDER,
    marketName: "proto_scroll_v3",
  },
  ethereumLido: {
    chainId: ChainId.mainnet,
    publicJsonRPCUrl: "https://eth-mainnet.alchemyapi.io/v2/demo",
    LENDING_POOL_ADDRESS_PROVIDER: AaveV3EthereumLido.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3EthereumLido.UI_POOL_DATA_PROVIDER,
    POOL: AaveV3EthereumLido.POOL,
    marketName: "proto_lido_v3",
  },
  ethereumEtherFi: {
    chainId: ChainId.mainnet,
    publicJsonRPCUrl: "https://eth-mainnet.alchemyapi.io/v2/demo",
    LENDING_POOL_ADDRESS_PROVIDER:
      AaveV3EthereumEtherFi.POOL_ADDRESSES_PROVIDER,
    UI_POOL_DATA_PROVIDER: AaveV3EthereumEtherFi.UI_POOL_DATA_PROVIDER,
    POOL: AaveV3EthereumEtherFi.POOL,
    marketName: "proto_etherfi_v3",
  },
};
