import { InvalidArgumentError, program } from "@commander-js/extra-typings";
import {
    Address,
    Hex,
    createPublicClient,
    createWalletClient,
    http,
    isAddress,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { VoucherFetcher } from "./voucherFetcher";
import { App } from "./app";

// option parse as Address
const addressParse = (value: string, _previous: Address): Address => {
    if (isAddress(value)) {
        return value;
    }
    throw new InvalidArgumentError("Invalid address");
};

// option parse as decimal number
const decimalNumberParse = (value: string, _previous: number): number => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        throw new InvalidArgumentError("Not a number");
    }
    return parsedValue;
};

program
    .name("lpm-provider-cli")
    .description(
        "CLI for LPM Providers to advance transfers as vouchers are emitted",
    )
    .option(
        "-a, --application-contract <address>",
        "Address of an application that emits LPM vouchers",
        addressParse,
        "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C",
    )
    .option(
        "-g, --graphql-url <url>",
        "URL of the application's GraphQL endpoint",
        "http://localhost:8080/graphql",
    )
    .option(
        "-r, --rpc-url <url>",
        "URL of a JSON-RPC endpoint for the base layer of the application, where the appropriate LPM contract is located",
        "http://localhost:8545",
    )
    .option(
        "-m, --mnemonic <string>",
        "BIP-39 mnemonic phrase to define the account that will execute advance transfers on the base layer",
        "test test test test test test test test test test test junk",
    )
    .option(
        "-l, --lpm-contract <address>",
        "Address of the LPM contract at the base layer of the application",
        "0x08d08e320e2b25184173331FcCCa122E4129523f",
    )
    .option(
        "-d, --debug",
        "Debug mode",
        false
    )
    .action(async (options) => {
        if (options.debug) {
            console.log("Options:", options);
        }

        const { applicationContract, lpmContract, graphqlUrl, rpcUrl } = options;

        // create VoucherFetcher
        const voucherFetcher = new VoucherFetcher(graphqlUrl);

        // create Ethereum provider clients
        console.log(`connecting to provider at ${rpcUrl}`);
        const account = mnemonicToAccount(options.mnemonic);
        const publicClient = createPublicClient({
            transport: http(rpcUrl),
        });
        const walletClient = createWalletClient({
            account,
            transport: http(rpcUrl),
        });

        // start application
        const application = new App(
            applicationContract,
            lpmContract as Hex,
            voucherFetcher,
            publicClient,
            walletClient,
        );
        application.run();
        console.log("application started");
    });

program.parse();
