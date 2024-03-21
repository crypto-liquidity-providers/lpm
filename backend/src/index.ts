// Import necessary modules
import { createApp } from "@deroll/app";
import { createWallet } from "@deroll/wallet";

// Create the application
const app = createApp({ url: process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004" });

// Create the wallet
const wallet = createWallet();

// Handle input encoded in hex
app.addAdvanceHandler(wallet.handler);

// Start the application
app.start().catch((e) => {
    console.error(e);
    process.exit(1);
});
