import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Clock, Info, X } from "lucide-react";
import React, { useState } from "react";

interface WithdrawalBlockProps {
  onRemove: () => void;
  maxAmount?: number;
}

interface ValidationError {
  amount?: string;
  general?: string;
}

interface WithdrawalRequest {
  id: string;
  amount: string;
  status: "pending" | "ready" | "claimed";
  timestamp: number;
}

const LidoSupplyBlock: React.FC<WithdrawalBlockProps> = ({
  onRemove,
  maxAmount = 0.006715403968507,
}) => {
  //hooks
  const { toast } = useToast();

  // State management
  const [amount, setAmount] = useState<string>("0.00");
  const [selectedCurrency, setSelectedCurrency] = useState<"ETH" | "$">("ETH");
  // const [selectedToken, setSelectedToken] = useState<string>("stETH");
  const [errors, setErrors] = useState<ValidationError>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [withdrawalMethod, setWithdrawalMethod] = useState<"lido" | "dex">(
  //   "lido"
  // );

  // Mock withdrawal requests for demo
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([
    {
      id: "1",
      amount: "0.5",
      status: "ready",
      timestamp: Date.now() - 432000000, // 5 days ago
    },
    {
      id: "2",
      amount: "0.3",
      status: "pending",
      timestamp: Date.now() - 86400000, // 1 day ago
    },
  ]);

  const pendingRequests = withdrawalRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const readyRequests = withdrawalRequests.filter(
    (req) => req.status === "ready"
  ).length;

  // Validation function
  const validateAmount = (value: string): ValidationError => {
    const errors: ValidationError = {};
    const numValue = parseFloat(value);
    const minAmount = 0.001; // Minimum amount in ETH

    if (!value || value === "0.00") {
      errors.amount = "Amount is required";
    } else if (isNaN(numValue)) {
      errors.amount = "Please enter a valid number";
    } else if (numValue < minAmount) {
      errors.amount = `Minimum amount is ${minAmount} ETH`;
    } else if (numValue > maxAmount) {
      errors.amount = "Amount exceeds available balance";
    }

    return errors;
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
    setAmount(value);
    setErrors(validateAmount(value));
  };

  // Handle request submission
  const handleRequest = async () => {
    const currentErrors = validateAmount(amount);
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newRequest: WithdrawalRequest = {
        id: Date.now().toString(),
        amount,
        status: "pending",
        timestamp: Date.now(),
      };

      setWithdrawalRequests([...withdrawalRequests, newRequest]);
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for ${amount} ETH has been submitted.`,
      });
      setAmount("0.00");
    } catch (error) {
      console.log({ error });
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle claim
  const handleClaim = async (requestId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setWithdrawalRequests((requests) =>
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "claimed" } : req
        )
      );
      toast({
        title: "Withdrawal Claimed",
        description: "Your withdrawal has been successfully claimed.",
      });
    } catch (error) {
      console.log({ error });
      toast({
        title: "Error",
        description: "Failed to claim withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format time remaining
  const formatTimeRemaining = (timestamp: number): string => {
    const hoursRemaining = Math.max(
      0,
      Math.floor((timestamp + 432000000 - Date.now()) / 3600000)
    );
    if (hoursRemaining > 24) {
      return `${Math.floor(hoursRemaining / 24)}d ${
        hoursRemaining % 24
      }h remaining`;
    }
    return `${hoursRemaining}h remaining`;
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white">
      {/* Header remains the same */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Withdrawal</h2>
          <span className="text-gray-400">⚙️</span>
        </div>
        <button onClick={onRemove} className="text-gray-500 hover:text-red-500">
          <X size={20} />
        </button>
      </div>

      {/* Request Status */}
      <div className="flex items-center gap-6 mb-6">
        <span className="text-gray-600">My requests</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 text-green-500">✓</div>
            <span>{readyRequests}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-orange-400" />
            <span>{pendingRequests}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="request" className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="request" className="flex-1">
            Request
          </TabsTrigger>
          <TabsTrigger value="claim" className="flex-1">
            Claim
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request">
          {/* Request Form Content */}
          <div className="space-y-4">
            {/* Available Amount */}
            <div className="border border-blue-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Available to request</span>
                  <Info size={14} className="text-gray-400" />
                </div>
                {/* <button className="flex items-center text-gray-600">
                  {walletAddress} <ChevronDown size={16} />
                </button> */}
              </div>
              <div className="text-xl font-semibold">
                ${(maxAmount * 2475).toFixed(2)} ~ {maxAmount}
              </div>
            </div>

            {/* Amount Input */}
            <div className="border border-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Amount</span>
                  <Info size={14} className="text-gray-400" />
                </div>
                {errors.amount && (
                  <span className="text-red-500 text-sm">{errors.amount}</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`flex-grow p-2 border rounded-lg text-lg ${
                    errors.amount ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <div className="flex border rounded-lg">
                  <button
                    onClick={() => setSelectedCurrency("ETH")}
                    className={`px-3 py-2 ${
                      selectedCurrency === "ETH" ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => setSelectedCurrency("$")}
                    className={`px-3 py-2 ${
                      selectedCurrency === "$" ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    $
                  </button>
                </div>
                <select className="border rounded-lg px-3">
                  <option value="stETH">stETH</option>
                </select>
              </div>
            </div>

            {/* Rest of the request form */}
            {/* ... (previous withdrawal options and transaction details remain the same) ... */}

            <Button
              className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100"
              onClick={handleRequest}
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? "Processing..." : "Request withdrawal"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="claim">
          {/* Claim Tab Content */}
          <div className="space-y-4">
            {withdrawalRequests.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No withdrawal requests found
              </div>
            ) : (
              withdrawalRequests
                .filter((req) => req.status !== "claimed")
                .map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{request.amount} ETH</span>
                      <span
                        className={`text-sm ${
                          request.status === "ready"
                            ? "text-green-500"
                            : "text-orange-400"
                        }`}
                      >
                        {request.status === "ready"
                          ? "Ready to claim"
                          : formatTimeRemaining(request.timestamp)}
                      </span>
                    </div>
                    <Button
                      className="w-full mt-2"
                      variant={
                        request.status === "ready" ? "default" : "secondary"
                      }
                      disabled={request.status !== "ready" || isLoading}
                      onClick={() => handleClaim(request.id)}
                    >
                      {request.status === "ready" ? "Claim" : "Pending"}
                    </Button>
                  </div>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LidoSupplyBlock;
