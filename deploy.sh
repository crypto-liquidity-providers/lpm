#!/usr/bin/env bash

set -euo pipefail

export ETH_FROM='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

LPM=`forge create --json --unlocked LPM | jq -r '.deployedTo'`

echo "Deployed LPM contract to $LPM"

TOTAL_SUPPLY=`cast max-uint`
TOKEN=`forge create --json --unlocked DummyToken --constructor-args "$TOTAL_SUPPLY" | jq -r '.deployedTo'`

echo "Deployed ERC-20 token contract to $TOKEN"

ERC20_PORTAL=`sunodo address-book --json | jq -r '.ERC20Portal'`

>/dev/null cast send --unlocked "$TOKEN" 'approve(address,uint256)' "$ERC20_PORTAL" "$TOTAL_SUPPLY"

echo "Approved the total supply of tokens to the ERC-20 portal"
