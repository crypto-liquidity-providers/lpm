import { Address, Hex } from "viem";

export class VoucherFetcher {
    private cursor: any;

    constructor(private graphqlUrl: string) {}

    public async fetchVoucher(): Promise<Voucher> {
        const queryParam = this.cursor
            ? `first: 1, after: \\"${this.cursor}\\"`
            : `first: 1`;
        const query = `{ "query": "{ vouchers(${queryParam}) { edges { node { destination payload } cursor } } }" }`;
        const fetched = await fetch(this.graphqlUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: query,
        });
        const json: any = await fetched.json();
        const edge = json?.data?.vouchers?.edges?.[0];
        if (edge) {
            this.cursor = edge.cursor;
        }
        return edge?.node as Voucher;
    }
}

export type Voucher = {
    destination: Address;
    payload: Hex;
};
