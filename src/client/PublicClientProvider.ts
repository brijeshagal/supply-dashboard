import { viemChainsById } from "@/utils/viem/chains";
import { type PublicClient, createPublicClient, fallback, http } from "viem";

class PublicClientProvider {
  private static instance: PublicClientProvider | null = null;

  private publicClients: Record<number, PublicClient> = {};

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): PublicClientProvider {
    if (!PublicClientProvider.instance) {
      PublicClientProvider.instance = new PublicClientProvider();
    }
    return PublicClientProvider.instance;
  }

  public getPublicClient(chainId: number): PublicClient {
    if (this.publicClients[chainId]) {
      return this.publicClients[chainId];
    }

    const publicClient = createPublicClient({
      chain: viemChainsById[chainId],
      // @TODO update fallback as per user's provided first,
      // then ours and lastly default
      transport: fallback([http()]),
    });

    this.publicClients[chainId] = publicClient;
    return publicClient;
  }
}

export default PublicClientProvider.getInstance();
