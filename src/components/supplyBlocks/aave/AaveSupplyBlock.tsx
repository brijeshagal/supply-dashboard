"use client";

import { aavePoolAbi } from "@/artifacts/aave";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import useBalance from "@/hooks/useBalance";
import { chainIdAaveModuleMap } from "@/utils/aave/contracts";
import {
  formatAndTrimUnits,
  getEllipsisText,
  trimAndParseUnits,
} from "@/utils/general/formatter";
import { viemChainsById } from "@/utils/viem/chains";
import { AaveV3Arbitrum } from "@bgd-labs/aave-address-book";
import { X } from "lucide-react";
import React, { useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  http,
  maxUint160,
  parseUnits,
} from "viem";
import { useAccount } from "wagmi";

interface SupplyBlockProps {
  onRemove: () => void;
  maxAmount?: number;
}

interface ValidationError {
  amount?: string;
  general?: string;
}

const AaveSupplyBlock: React.FC<SupplyBlockProps> = ({ onRemove }) => {
  // State management
  const { address, chainId: connectedChainId } = useAccount();

  const chainId = connectedChainId || 42161;
  const { balance } = useBalance();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0.00");
  const [selectedCurrency, setSelectedCurrency] = useState<"Token" | "$">(
    "Token"
  );
  const [selectedNetwork, setSelectedNetwork] = useState<string>(
    viemChainsById[Number(chainId)].nativeCurrency.symbol
  );
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [errors, setErrors] = useState<ValidationError>({});
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const maxAmount = balance?.value || BigInt(0);
  const supplyAPY = 1.88;

  // Validation function
  const validateAmount = (value: string): ValidationError => {
    const errors: ValidationError = {};
    const numValue = parseFloat(value);

    if (!value || value === "0.00") {
      errors.amount = "Amount is required";
    } else if (isNaN(numValue)) {
      errors.amount = "Please enter a valid number";
    } else if (numValue <= 0) {
      errors.amount = "Amount must be greater than 0";
    } else if (trimAndParseUnits(value, 18) > maxAmount || maxAmount === 0n) {
      errors.amount = "Amount exceeds wallet balance";
    }

    return errors;
  };

  // Handle amount change with validation
  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(value) && value !== "") return;

    setAmount(value);
    setErrors(validateAmount(value));

    // Update slider value based on amount
    const percentage =
      maxAmount !== 0n ? Number(parseUnits(value, 18) / maxAmount) * 100 : 0;
    setSliderValue(isNaN(percentage) ? 0 : Math.min(percentage, 100));
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    setSliderValue(percentage);

    // Calculate new amount based on percentage
    const newAmount = formatAndTrimUnits(
      (maxAmount * BigInt(percentage)) / BigInt(100),
      18
    );
    setAmount(newAmount);
    setErrors(validateAmount(newAmount));
  };

  // Quick select percentage buttons
  const handleQuickSelect = (percentage: number) => {
    setSliderValue(percentage);
    const newAmount = formatAndTrimUnits(
      (maxAmount * BigInt(percentage)) / BigInt(100),
      18
    );
    setAmount(newAmount);
    setErrors(validateAmount(newAmount));
  };

  // Supply function
  const handleSupply = async () => {
    const currentErrors = validateAmount(amount);
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }
    try {
      setIsLoading(true);
      // Simulate API call
      if (chainId && address) {
        const parsedAmount = trimAndParseUnits(amount, 18);
        const walletClient = createWalletClient({
          transport: custom(window.ethereum),
          chain: viemChainsById[chainId],
          account: address,
        });
        const approvalHash = await walletClient.writeContract({
          abi: erc20Abi,
          address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          functionName: "approve",
          args: [AaveV3Arbitrum.POOL, maxUint160],
        });

        const publicClient = createPublicClient({
          transport: http(),
          chain: viemChainsById[chainId],
        });
        const approvalReceipt = await publicClient.waitForTransactionReceipt({
          hash: approvalHash,
        });
        if (approvalReceipt.status === "success") {
          const hash = await walletClient.writeContract({
            abi: aavePoolAbi,
            address: chainIdAaveModuleMap[chainId].POOL,
            functionName: "supply",
            args: [
              "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
              parsedAmount,
              address,
              0,
            ],
          });
          const supplyReceipt = await publicClient.waitForTransactionReceipt({
            hash,
          });
          console.log({ supplyReceipt });
        }
      }
      setShowConfirmation(true);
      toast({
        title: "Supply Initiated",
        description: `Supplying ${amount} ${
          viemChainsById[Number(chainId)].nativeCurrency.symbol
        }`,
      });
    } catch (error) {
      console.log({ error });
      toast({
        title: "Error",
        description: "Failed to initiate supply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Supply</h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() =>
              toast({
                title: "Settings",
                description: "Settings panel coming soon",
              })
            }
          >
            ⚙️
          </button>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Wallet Balance Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">Wallet balance</span>
          <button
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
            onClick={() =>
              toast({
                title: "Wallet",
                description: "Wallet details coming soon",
              })
            }
          >
            <span>{address ? getEllipsisText(address) : ""}</span>
            <span>▼</span>
          </button>
        </div>
        <div className="text-2xl font-semibold text-gray-800">
          ~{formatAndTrimUnits(maxAmount, 18, 12)}
        </div>
      </div>

      {/* Amount Input Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">Amount</span>
          {errors.amount && (
            <span className="text-red-500 text-sm">{errors.amount}</span>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={`flex-grow p-2 border rounded-lg text-lg ${
              errors.amount ? "border-red-500" : "border-gray-200"
            }`}
          />
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setSelectedCurrency("Token")}
              className={`px-3 py-2 ${
                selectedCurrency === "Token"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Token
            </button>
            <button
              onClick={() => setSelectedCurrency("$")}
              className={`px-3 py-2 ${
                selectedCurrency === "$"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              $
            </button>
          </div>
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option
              value={viemChainsById[Number(chainId)].nativeCurrency.symbol}
            >
              {viemChainsById[Number(chainId)].nativeCurrency.symbol}
            </option>
          </select>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex gap-2 mb-4">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => handleQuickSelect(percent)}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
            >
              {percent}%
            </button>
          ))}
        </div>

        {/* Percentage Slider */}
        <Slider
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Transaction Overview */}
      <div className="mb-6">
        <h3 className="text-gray-500 text-sm mb-4">Transaction overview</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Supply APY</span>
          <span className="text-gray-800 font-medium">{supplyAPY} %</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Collateralization</span>
          <span className="text-green-500">Enabled</span>
        </div>
        {/* <div className="flex items-center gap-1 text-gray-500 text-sm">
          <span>≈ ${amountInUsd.toFixed(2)}</span>
          <button
            onClick={() =>
              toast({
                title: "Price Info",
                description: `Current ETH price: $${ethPrice}`,
              })
            }
          >
            <span className="text-gray-400">○</span>
          </button>
        </div> */}
      </div>

      {/* Supply Button */}
      <Button
        className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200 py-3 rounded-lg font-medium"
        onClick={handleSupply}
        disabled={isLoading || Object.keys(errors).length > 0}
      >
        {isLoading ? "Supplying..." : "Supply"}
      </Button>
    </Card>
  );
};

export default AaveSupplyBlock;
