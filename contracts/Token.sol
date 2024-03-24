// SPDX-License-Identifier: GPL-3.0-only

pragma solidity 0.8.24;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(uint256 totalSupply) ERC20("Token", "TOK") {
        _mint(msg.sender, totalSupply);
    }
}
