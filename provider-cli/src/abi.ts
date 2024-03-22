export const lpmAbi = [
    {
        type: "function",
        name: "advanceTransfer",
        inputs: [
            {
                name: "appContract",
                type: "address",
                internalType: "address",
            },
            {
                name: "token",
                type: "address",
                internalType: "contract IERC20",
            },
            {
                name: "recipient",
                type: "address",
                internalType: "address",
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "fee",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "deadline",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "requestId",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "transfer",
        inputs: [
            {
                name: "token",
                type: "address",
                internalType: "contract IERC20",
            },
            {
                name: "recipient",
                type: "address",
                internalType: "address",
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "fee",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "deadline",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "requestId",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "event",
        name: "AdvanceTransferred",
        inputs: [
            {
                name: "appContract",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "token",
                type: "address",
                indexed: true,
                internalType: "contract IERC20",
            },
            {
                name: "recipient",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "fee",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "deadline",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "requestId",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
    {
        type: "error",
        name: "AdvanceAlreadyTransferred",
        inputs: [],
    },
    {
        type: "error",
        name: "DeadlineElapsed",
        inputs: [],
    },
    {
        type: "error",
        name: "ERC20TransferFailed",
        inputs: [],
    },
] as const;
