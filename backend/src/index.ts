// Import necessary modules
import { createApp } from "@deroll/app";
import { createWallet } from "@deroll/wallet";
import { encodeFunctionData, decodeFunctionData, parseAbi, Hex } from "viem";

// State variables
let lpmContractAddress : Hex = "0xc22107f40E3Bb32dB949D236c50e33424C2f8b9a";
let requestId : bigint = BigInt(0);

// Parse contract ABIs
const lpmContractAbi = parseAbi([
    "function transfer(address token, address recipient, uint256 amount, uint256 fee, uint256 deadline, uint256 requestId)",
]);

const erc20Abi = parseAbi([
    "function approve(address spender, uint256 value)",
]);

const advanceAbi = parseAbi([
    "function withdraw(address token, uint256 amount, uint256 fee, uint256 deadline)",
]);

// Create the application
const app = createApp({ url: process.env.ROLLUP_HTTP_SERVER_URL! });

// Create the wallet
const wallet = createWallet();

// Handle wallet actions
app.addAdvanceHandler(wallet.handler);

// Handle input encoded as Solidity function calldata
app.addAdvanceHandler(async ({ payload, metadata }) => {

    const { functionName, args } = decodeFunctionData({
        abi: advanceAbi,
        data: payload,
    });

    console.log(`functionName: ${functionName}`);
    console.log(`args: ${args}`);

    switch (functionName) {
        case "withdraw":
            {
                const [token, amount, fee, deadline] = args;

               // approve
                {
                    const payload = encodeFunctionData({
                        abi: erc20Abi,
                        functionName: "approve",
                        args: [
                            lpmContractAddress,
                            amount,
                        ]
                    });

                    app.createVoucher({
                        destination: token,
                        payload: payload
                    });
                }

                // transfer
                {
                    const { msg_sender } = metadata;

                    // Raises an error if msg.sender doesn't have enough tokens
                    wallet.withdrawERC20(token, msg_sender, amount);

                    const payload = encodeFunctionData({
                        abi: lpmContractAbi,
                        functionName: "transfer",
                        args: [
                            token,
                            msg_sender,
                            amount,
                            fee,
                            deadline,
                            requestId++
                        ],
                    })

                    app.createVoucher({
                        destination: lpmContractAddress,
                        payload: payload,
                    });
                }

                return "accept";
            }
        default:
            return "reject";
    }
});

// Start the application
app.start().catch((e) => {
    console.error(e);
    process.exit(1);
});
