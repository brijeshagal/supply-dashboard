import PublicClientProvider from "@/client/PublicClientProvider";

export const getPublicClient = (chainId: number) => {
  return PublicClientProvider.getPublicClient(chainId);
};
