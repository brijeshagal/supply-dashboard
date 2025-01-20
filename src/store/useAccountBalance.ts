import { AccountBalanceStore } from "@/types/store/balance";
import { create } from "zustand";

export const useAccountBalance = create<AccountBalanceStore>((set) => ({
  accountBalance: undefined,
  setAccountBalance: (balance) => set({ accountBalance: balance }),
}));
