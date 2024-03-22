import { Address, PublicClient, WalletClient, decodeFunctionData } from "viem";
import { VoucherFetcher } from "./voucherFetcher";
import { lpmAbi } from "./abi";

export class App {
    constructor(
        private appContract: Address,
        private lpmContract: Address,
        private voucherFetcher: VoucherFetcher,
        private publicClient: PublicClient,
        private walletClient: WalletClient,
    ) {}

    public async run() {
        try {
            const voucher = await this.voucherFetcher.fetchVoucher();
            if (voucher) {
                // there is a new voucher: let's analyze it
                if (voucher.destination === this.lpmContract) {
                    // voucher is for the LPM contract: let's check which function it encodes
                    const { functionName, args } = decodeFunctionData({
                        abi: lpmAbi,
                        data: voucher.payload,
                    });
                    if (functionName === "transfer") {
                        // voucher is for the LPM transfer function: let's provide liquidity by calling advanceTransfer
                        console.log(
                            `Advancing payment for transfer voucher '${JSON.stringify(args)}'`,
                        );
                        const { request } =
                            await this.publicClient.simulateContract({
                                account: this.walletClient.account,
                                address: this.lpmContract,
                                abi: lpmAbi,
                                functionName: "advanceTransfer",
                                args: [this.appContract, ...args],
                            });
                        await this.walletClient.writeContract(request);
                    }
                } else {
                    console.log(
                        `Ignoring voucher with destination ${voucher.destination}`,
                    );
                }
            }
        } catch (error) {
            console.error(`Caught exception: ${JSON.stringify(error)}`);
        }
        setTimeout(this.run.bind(this), 500);
    }
}
