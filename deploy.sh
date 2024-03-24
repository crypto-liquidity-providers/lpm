#!/usr/bin/env bash

set -euo pipefail

export ETH_FROM='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

APPLICATION='0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C'
INPUT_BOX='0x59b22D57D4f067708AB0c00552767405926dc768'

LPM=`forge create --json --unlocked LPM | jq -r '.deployedTo'`

echo "Deployed LPM contract to $LPM"

TOTAL_SUPPLY=`cast max-uint`
TOKEN=`forge create --json --unlocked DummyToken --constructor-args "$TOTAL_SUPPLY" | jq -r '.deployedTo'`

echo "Deployed ERC-20 token contract to $TOKEN"

ERC20_PORTAL=`sunodo address-book --json | jq -r '.ERC20Portal'`

>/dev/null cast send --unlocked "$TOKEN" 'approve(address,uint256)' "$ERC20_PORTAL" "$TOTAL_SUPPLY"

echo "Approved the total supply of tokens to the ERC-20 portal"

AMOUNT=42

>/dev/null cast send --unlocked "$ERC20_PORTAL" 'depositERC20Tokens(address,address,uint256,bytes)' "$TOKEN" "$APPLICATION" "$AMOUNT" '0x'

# Encodes input with Solidity ABI and send it to the application's input box
add_input() {
    local input=`cast calldata "$@"`
    >/dev/null cast send --unlocked "$INPUT_BOX" 'addInput(address,bytes)' "$APPLICATION" "$input"
    echo "Added input:" "$@"
}

add_input 'setLPM(address)' "$LPM"

FEE=5
TIMESTAMP=`cast block -f timestamp latest`
DEADLINE=$(( "$TIMESTAMP" + 60*60*24 ))

add_input 'withdraw(address,uint256,uint256,uint256)' "$TOKEN" "$AMOUNT" "$FEE" "$DEADLINE"
