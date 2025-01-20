import { padHex, toHex } from "viem";

export function packSupplyArgs({
  assetId,
  amount,
  referralCode = 0,
}: {
  assetId: string;
  amount: string;
  referralCode?: number;
}) {
  // Shift values to their correct bit positions
  const packedValue =
    BigInt(assetId) |
    (BigInt(amount) << BigInt(16)) |
    (BigInt(referralCode) << BigInt(144));

  // Convert to bytes32
  return padHex(toHex(packedValue), { size: 32 });
}
