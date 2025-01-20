import usePrevious from "@/hooks/usePrevious";
import { useAccountBalance } from "@/store/useAccountBalance";
import { viemChainsById } from "@/utils/viem/chains";
import { useEffect } from "react";
import { createPublicClient, formatUnits, http } from "viem";
import { Config, useAccount, UseAccountReturnType } from "wagmi";

export default function useBalance() {
  const account = useAccount();
  const { setAccountBalance, accountBalance } = useAccountBalance();
  const accountRef = usePrevious<UseAccountReturnType<Config> | undefined>(
    undefined
  );

  const fetchBalance = async () => {
    if (
      account.chainId &&
      account.address &&
      (accountRef.current?.address !== account.address ||
        accountRef.current?.chainId !== account.chainId)
    ) {
      try {
        const userBalance = await createPublicClient({
          chain: viemChainsById[account.chainId],
          transport: http(),
        }).getBalance({
          address: account.address,
        });
        const nativeDetails = viemChainsById[account.chainId].nativeCurrency;
        setAccountBalance({
          value: userBalance,
          symbol: nativeDetails.symbol,
          formatted: formatUnits(userBalance, nativeDetails.decimals),
        });
      } catch (e) {
        console.log({ e });
        setAccountBalance(undefined);
      }
      accountRef.current = account;
    }
  };
  useEffect(() => {
    fetchBalance();
  }, [account.chainId, account.address, account.connector, setAccountBalance]);

  return {
    balance: accountBalance,
    refetch: fetchBalance,
  };
}
