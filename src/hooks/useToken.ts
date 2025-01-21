import { multicall } from "@/utils/viem/publicClient";
import { useCallback } from "react";
import { erc20Abi, type Address } from "viem";
import { useAccount } from "wagmi";

const useToken = () => {
  const { chainId, address } = useAccount();

  const getApprovalAndBalance = useCallback(
    async (
      tokenAddress: Address,
      spender: Address
    ): Promise<{ approval: bigint; balance: bigint }> => {
      try {
        if (!chainId || !address) return { balance: 0n, approval: 0n };

        const multicallRes = await multicall({
          contracts: [
            {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "allowance",
              args: [address, spender],
            },
            {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [address],
            },
          ],
          chainId,
        });
        const results = multicallRes.map((result) => {
          const val = result.result;
          return val;
        });

        return {
          approval: results[0] as bigint,
          balance: results[1] as bigint,
        };
      } catch (err) {
        console.error("Error fetching approval balance:", err);
        return { approval: 0n, balance: 0n };
      }
    },
    [chainId, address]
  );

  return { getApprovalAndBalance };
};

export default useToken;
