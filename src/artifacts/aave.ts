export const aavePoolAbi = [
  {
    type: "function",
    name: "supply",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "asset",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "onBehalfOf",
        type: "address",
      },
      {
        name: "referralCode",
        type: "uint16",
      },
    ],
    outputs: [],
    payable: false,
  },
] as const;

export const aaveWETHAbi = [
  {
    type: "function",
    name: "depositETH",
    stateMutability: "payable",
    payable: true,
    inputs: [
      {
        name: "asset",
        type: "address",
        description:
          "The asset being deposited (ETH in this case, typically wrapped).",
      },
      {
        name: "onBehalfOf",
        type: "address",
        description: "The address that will receive the deposited ETH.",
      },
      {
        name: "referralCode",
        type: "uint16",
        description: "A referral code for tracking third-party integrations.",
      },
    ],
    outputs: [],
    description:
      "Allows users to deposit ETH into the protocol, optionally on behalf of another address.",
  },
];
