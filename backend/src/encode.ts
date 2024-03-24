#!/usr/bin/env node
import { Command } from "commander";

import tokenDeployment from "./deployments/token.json";
import { advanceAbi } from "./advance";
import { encodeFunctionData } from "viem";

const program = new Command();

program
    .name("encode")
    .version("0.1.0")
    .description("Encode advance requests");

program
    .command("withdraw")
    .description("Withdraw ERC-20 tokens through LPM")
    .requiredOption("-t, --token <address>", "ERC-20 token contract address", tokenDeployment.address)
    .requiredOption("-a, --amount <uint256>", "Amount of tokens")
    .requiredOption("-f, --fee <uint256>", "Amount of tokens to be deduced for the liquidity provider")
    .requiredOption("-d, --deadline <uint256>", "UNIX epoch timestamp of liquidity request deadline (in seconds)")
    .action((options) => {
        console.log(
            encodeFunctionData({
                abi: advanceAbi,
                functionName: "withdraw",
                args: [
                    options.token,
                    options.amount,
                    options.fee,
                    options.deadline,
                ],
            })
        );
    });

program.parse();
