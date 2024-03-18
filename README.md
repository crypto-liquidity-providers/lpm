# Liquidity Provider Marketplace for Cartesi Rollups

This is a proof-of-concept for a liquidity provider marketplace meant to be used by Cartesi Rollups applications.

## Dependencies

- [`foundry`](https://book.getfoundry.sh/)

## Setup

1. Initialize the git submodules.

```sh
git submodule update --init --recursive
```

2. Build the contracts.

```sh
forge build
```

## Deployment

Depending on the network you're deploying to, and on your wallet, you might need provide different options to the following command. Consult the [`forge create`](https://book.getfoundry.sh/reference/forge/forge-create) documentation page for more information.

```sh
forge create [options...] LPM
```

If deployment is successful, the `LPM` contract address will be displayed.
