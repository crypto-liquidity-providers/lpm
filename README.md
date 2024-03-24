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

With `sunodo` (or `nonodo`) running on the background, you may deploy the contracts.

```sh
make deploy
```

> [!NOTE]
> If you run `git status` and some file under the `./deployments` directory has changed,
> you might want to re-run your back-end to make sure deployment addresses are synchronized.
