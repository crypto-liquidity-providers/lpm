# Liquidity Provider Marketplace for Cartesi Rollups

This is a proof-of-concept for a liquidity provider marketplace meant to be used by Cartesi Rollups applications.

## Dependencies

- [`foundry`](https://book.getfoundry.sh/)

## Setup

Initialize the git submodules.

```sh
git submodule update --init --recursive
```

## Deployment

Depending on the network you're deploying to, and on your wallet, you might need provide different options to the following command. Consult the [`forge create`](https://book.getfoundry.sh/reference/forge/forge-create) documentation page for more information.

```sh
forge create [options...] LPM
```

For example, if you're running an `anvil` node, you can use any of the unlocked accounts.

```sh
export ETH_FROM='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
forge create --unlocked LPM
```

If deployment is successful, the `LPM` contract address will be displayed.
