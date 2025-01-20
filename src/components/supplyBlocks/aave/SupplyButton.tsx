import { aaveAbi } from "@/artifacts/aave";
import { chainIdAaveModuleMap } from "@/utils/aave/contracts";
import { Address } from "viem";
import { useAccount, useWriteContract } from "wagmi";

const SupplyButton = ({
  selectedAsset,
  amount,
}: {
  selectedAsset: string;
  amount: string;
}) => {
  const { writeContract } = useWriteContract();
  const { chainId, address } = useAccount();
  return (
    <button
      onClick={() => {
        if (chainId && address) {
          writeContract({
            abi: aaveAbi,
            address: chainIdAaveModuleMap[chainId].POOL,
            functionName: "supply",
            args: [selectedAsset as Address, BigInt(amount), address, 0],
          });
        }
      }}
    >
      SupplyButton
    </button>
  );
};

export default SupplyButton;
