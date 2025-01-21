import { getPublicClient } from "@/utils/viem/publicClient";
import { getWalletClient } from "@/utils/viem/walletClient";
import { Address, erc20Abi } from "viem";

export default function useApprove() {
  async function approve({
    to,
    amount,
    token,
    address,
    chainId,
  }: {
    token: string;
    to: string;
    amount: bigint;
    address: Address;
    chainId: number;
  }) {
    if (!chainId || !address) return;
    const approvalHash = await getWalletClient(chainId).writeContract({
      abi: erc20Abi,
      address: token as Address,
      functionName: "approve",
      args: [to as Address, amount],
      account: address,
    });

    const publicClient = getPublicClient(chainId);
    const approvalReceipt = await publicClient.waitForTransactionReceipt({
      hash: approvalHash,
    });
    return approvalReceipt;
  }
  return { approve };
}
