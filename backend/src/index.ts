// Import necessary modules
import { createApp } from "@deroll/app";
import { createWallet } from "@deroll/wallet";
import { encodeFunctionData, decodeFunctionData, parseAbi, Hex, getAddress } from "viem";

const owner = getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

// State variables
let lpmContractAddress : Hex | undefined;
let requestId : bigint = BigInt(0);

const lpmContractAbi = parseAbi([
    "function transfer(address token, address recipient, uint256 amount, uint256 fee, uint256 deadline, uint256 requestId)",
]);

const erc20Abi = parseAbi([
    "function approve(address spender, uint256 value)",
]);

// Create the application
const app = createApp({ url: process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004" });

const advanceAbi = parseAbi([
    "function approve(address token, uint256 amount)",
    "function setLPM(address lpm)",
    "function withdraw(address token, uint256 amount, uint256 fee, uint256 deadline)",
]);

// Create the wallet
const wallet = createWallet();

// Handle wallet actions
app.addAdvanceHandler(wallet.handler);

// Handle input encoded in hex
app.addAdvanceHandler(async ({ payload, metadata }) => {

    const { functionName, args } = decodeFunctionData({
        abi: advanceAbi,
        data: payload,
    });

    console.log(`functionName: ${functionName}`);
    console.log(`args: ${args}`);

    switch (functionName) {
        case "approve":
            {
                const [token, amount] = args;

                if (lpmContractAddress === undefined) {
                    console.log("LPM contract address not defined");
                    return "reject";
                }

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

                return "accept";
            }
        case "setLPM":
            {
                const [lpm] = args;

                const { msg_sender } = metadata;

                if (getAddress(msg_sender) != owner) {
                    return "reject";
                }

                if (lpmContractAddress !== undefined) {
                    return "reject";
                }

                lpmContractAddress = lpm;

                return "accept";
            }
        case "withdraw":
            {
                const [token, amount, fee, deadline] = args;

                const { msg_sender } = metadata;

                if (lpmContractAddress === undefined) {
                    console.log("LPM contract address not defined");
                    return "reject";
                }

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
                        requestId
                    ],
                })

                app.createVoucher({
                    destination: lpmContractAddress,
                    payload: payload,
                });

                requestId++;

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
