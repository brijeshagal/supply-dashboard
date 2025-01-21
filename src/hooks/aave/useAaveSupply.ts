import { aavePoolAbi } from "@/artifacts/aave";
import { chainIdAaveModuleMap } from "@/constants/aave/supply";
import { getPublicClient } from "@/utils/viem/publicClient";
import { getWalletClient } from "@/utils/viem/walletClient";
import { Address } from "viem";
import useApprove from "../useApproval";

export default function useAaveSupply() {
  const { approve } = useApprove();
  async function approveAndSupply({
    approvalRequired,
    amount,
    address,
    chainId,
    token,
  }: {
    approvalRequired: boolean;
    amount: bigint;
    address: Address;
    chainId: number;
    token: Address;
  }) {
    try {
      const goForSupply = !approvalRequired;
      const poolAddress = chainIdAaveModuleMap[chainId].POOL;
      if (approvalRequired) {
        const receipt = await approve({
          amount,
          to: poolAddress,
          token,
          address,
          chainId,
        });
        if (receipt?.status === "success") {
        }
      }
      if (goForSupply) {
        const walletClient = getWalletClient(chainId);
        const hash = await walletClient.writeContract({
          abi: aavePoolAbi,
          address: poolAddress,
          functionName: "supply",
          args: [token, amount, address, 0],
          account: address,
        });
        const supplyReceipt = await getPublicClient(
          chainId
        ).waitForTransactionReceipt({
          hash,
        });
        return supplyReceipt;
      }
    } catch (e) {
      console.log({ e });
    }
  }
  return { approveAndSupply };
}
