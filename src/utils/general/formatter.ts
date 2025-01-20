import { DEFAULT_DECIMAL_TRIM } from "@/constants/general/trim";
import { formatUnits, parseUnits } from "viem";

export const formatAndTrimUnits = (
  val: bigint | string,
  decimals: number,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const formattedVal = parseFloat(formatUnits(BigInt(val), decimals));
  return formattedVal.toFixed(units);
};

export const trimUnits = (
  val: number | string,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const parsedNum = Number(val);
  return parsedNum.toFixed(units);
};

export const trimAndParseUnits = (amount: string, decimals: number) => {
  return parseUnits(trimUnits(amount, decimals), decimals);
};

export const getEllipsisText = (str: string, n: number = 6): string => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
};
