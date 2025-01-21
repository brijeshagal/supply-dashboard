import { viemChainsById } from "@/utils/viem/chains";
import { getWalletClient } from "@/utils/viem/walletClient";
import { LidoSDK } from "@lidofinance/lido-ethereum-sdk";
import { useAccount } from "wagmi";

export default function useLido() {
  const { address, chainId } = useAccount();

  async function stakeEth({ amount }: { amount: bigint }) {
    if (!chainId || !address) return;
    const walletClient = getWalletClient(chainId);
    const rpcUrls = viemChainsById[chainId].rpcUrls.default.http as string[];

    const lidoSDK = new LidoSDK({
      chainId: 17000,
      rpcUrls,
      web3Provider: walletClient,
    });

    // Calls
    const stakeTx = await lidoSDK.stake.stakeEth({
      value: amount,
      // callback: () => void,
      // referralAddress,
      account: address,
    });

    // relevant results are returned with transaction
    if (stakeTx.receipt?.status === "success" && stakeTx.result) {
      const { stethReceived, sharesReceived } = stakeTx.result;
      console.log({ stethReceived, sharesReceived });
    }
  }

  async function approveAndWrapSteth({ amount }: { amount: bigint }) {
    if (!chainId || !address) return;
    const walletClient = getWalletClient(chainId);
    const rpcUrls = viemChainsById[chainId].rpcUrls.default.http as string[];

    const lidoSDK = new LidoSDK({
      chainId,
      rpcUrls,
      web3Provider: walletClient,
    });

    // Calls
    const approveTx = await lidoSDK.wrap.approveStethForWrap({
      value: amount,
      account: address,
    });
    if (approveTx.receipt?.status === "success" && approveTx.result) {
      const { stethReceived, sharesReceived } = approveTx.result;
      console.log({ stethReceived, sharesReceived });
      const wrapTx = await lidoSDK.wrap.convertStethToWsteth(amount);
      return wrapTx;
    }
  }

  return { stakeEth, approveAndWrapSteth };
}
