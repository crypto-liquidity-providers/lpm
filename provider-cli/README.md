# CLI application for Liquidity Providers

This is a CLI tool for agents wishing to provide liquidity to a Cartesi Rollups application that supports LPM transfers.

Its basic logic is to monitor LPM transfer vouchers emitted by applications, and for each voucher automatically submit a transaction to advance the payment to the final recipient, collecting the specified fee.

## Build

```shell
pnpm install
```

## Run

```shell
pnpm start <address> [options]
```

where `address` refers to the address of the application contract of interest. Please use option `--help` to check all available options.
