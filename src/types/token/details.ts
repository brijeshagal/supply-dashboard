export type TokenDetails = {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  chainId: number;
  isNative?: boolean;
};
