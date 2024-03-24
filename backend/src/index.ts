// Import necessary modules
import { createApp } from "@deroll/app";
import { createWallet } from "@deroll/wallet";
import { encodeFunctionData, decodeFunctionData, parseAbi, Hex } from "viem";

import lpmDeployment from "./deployments/lpm.json";
import { erc20Abi } from "./erc20";

// Constants
const lpmContractAddress = lpmDeployment.address as Hex;

// State variables
let requestId : bigint = BigInt(0);

// Define advance request payload ABI
const abi = parseAbi([
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

    const { functionName, args } = decodeFunctionData({ abi, data: payload });

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
                        abi: lpmDeployment.abi,
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
