# Liquidity Provider Marketplace for Cartesi Rollups

This is a proof-of-concept for a liquidity provider marketplace meant to be used by Cartesi Rollups applications.

## Dependencies

- [`cannon`](https://usecannon.com)
- [`foundry`](https://book.getfoundry.sh)
- [`jq`](https://jqlang.github.io/jq/)
- [`sunodo`](https://sunodo.io)

## Setup

Initialize the git submodules.

```sh
git submodule update --init --recursive
```

## Deployment

While `nonodo` or `sunodo` is running on the background, you may deploy the contracts.

```sh
make deploy
```
