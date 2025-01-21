import { ValidationError } from "@/types/validations";
import { trimAndParseUnits } from "../general/formatter";

export const validateAmount = ({
  decimals,
  maxAmount,
  value,
}: {
  value: string;
  maxAmount: bigint;
  decimals: number;
}): ValidationError => {
  const errors: ValidationError = {};
  const numValue = parseFloat(value);

  if (!value || value === "0.00") {
    errors.amount = "Amount is required";
  } else if (isNaN(numValue)) {
    errors.amount = "Please enter a valid number";
  } else if (numValue <= 0) {
    errors.amount = "Amount must be greater than 0";
  } else if (
    trimAndParseUnits(value, decimals) > maxAmount ||
    maxAmount === 0n
  ) {
    errors.amount = "Amount exceeds wallet balance";
  }

  return errors;
};
