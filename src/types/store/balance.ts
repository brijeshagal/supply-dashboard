export type AccountBalance = { value: bigint; symbol: string; formatted: string } | undefined;

export interface AccountBalanceStore {
  accountBalance: AccountBalance;
  setAccountBalance: (balance: AccountBalance) => void;
}
