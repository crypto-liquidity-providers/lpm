import { InvalidArgumentError, program } from '@commander-js/extra-typings';
import {
    Address,
    createPublicClient,
    http,
    isAddress,
} from "viem";

// option parse as Address
const addressParse = (value: string, _previous: Address): Address => {
    if (isAddress(value)) {
        return value;
    }
    throw new InvalidArgumentError("Invalid address");
};

program
    .name("lpm-provider-cli")
    .description("CLI for LPM Providers to advance transfers as vouchers are emitted")
    .argument("<app>", "Address of an application that emits LPM vouchers", addressParse)
    .option(
        "-g, --graphql-url <url>",
        "URL of the application's GraphQL endpoint",
        "http://localhost:8080/graphql"
    )
    .option(
        "-r, --rpc-url <url>",
        "URL of a JSON-RPC endpoint for the base layer of the application, where the appropriate LPM contract is located",
        "http://localhost:8545"
    )
    .option(
        "-l, --lpm-address <address>",
        "Address of the LPM contract at the base layer of the application",
        "0x08d08e320e2b25184173331FcCCa122E4129523f"
    )
    .action((app, options) => {
        const {
            graphqlUrl,
            rpcUrl,
            lpmAddress
        } = options;

        // create GraphQL client
        // TODO

        // create Ethereum client
        console.log(`connecting to provider at ${rpcUrl}`);
        const client = createPublicClient({ transport: http(rpcUrl) });

        console.log("App:", app);
        console.log('Options:', options);
    }
    )

program.parse(process.argv)
