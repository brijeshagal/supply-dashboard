import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from "viem";
import { arbitrum, mainnet, polygon, sepolia } from "viem/chains";
import { createConfig } from "wagmi";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet, trustWallet],
    },
  ],
  {
    appName: "viem-tutorial",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECTID ?? "",
  }
);

export const getWagmiConfig = () =>
  createConfig({
    chains: [mainnet, arbitrum, polygon, sepolia],
    connectors,
    transports: {
      [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
      [arbitrum.id]: http(
        `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
      ),
      [polygon.id]: http(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
      ),
      [sepolia.id]: http(),
    },
  });
