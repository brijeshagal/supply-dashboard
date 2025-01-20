import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import React, { useState } from "react";

interface SupplyBlockProps {
  onRemove: () => void;
  maxAmount?: number;
}

interface ValidationError {
  amount?: string;
  general?: string;
}

const AaveSupplyBlock: React.FC<SupplyBlockProps> = ({
  onRemove,
  maxAmount = 0.006715403968507,
}) => {
  // State management
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("0.00");
  const [selectedCurrency, setSelectedCurrency] = useState<"Token" | "$">(
    "Token"
  );
  const [selectedNetwork, setSelectedNetwork] = useState<string>("ETH");
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [errors, setErrors] = useState<ValidationError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Derived values
  const ethPrice = 2475; // Mock ETH price in USD
  const amountInUsd = parseFloat(amount) * ethPrice;
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
    } else if (numValue > maxAmount) {
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
    const percentage = (parseFloat(value) / maxAmount) * 100;
    setSliderValue(isNaN(percentage) ? 0 : Math.min(percentage, 100));
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    setSliderValue(percentage);

    // Calculate new amount based on percentage
    const newAmount = ((maxAmount * percentage) / 100).toFixed(18);
    setAmount(newAmount);
    setErrors(validateAmount(newAmount));
  };

  // Quick select percentage buttons
  const handleQuickSelect = (percentage: number) => {
    setSliderValue(percentage);
    const newAmount = ((maxAmount * percentage) / 100).toFixed(18);
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

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowConfirmation(true);
      toast({
        title: "Supply Initiated",
        description: `Supplying ${amount} ETH (≈ $${amountInUsd.toFixed(2)})`,
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
            <span>0x6c...ea00</span>
            <span>▼</span>
          </button>
        </div>
        <div className="text-2xl font-semibold text-gray-800">
          ${(maxAmount * ethPrice).toFixed(2)} ~ {maxAmount}
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
            <option value="ETH">ETH</option>
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
        <div className="flex items-center gap-1 text-gray-500 text-sm">
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
        </div>
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
