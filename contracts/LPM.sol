// SPDX-License-Identifier: GPL-3.0-only

pragma solidity 0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/// @notice Liquidity Provider Marketplace
contract LPM {

    // State variables

    mapping(address appContract =>
        mapping(IERC20 token =>
            mapping(address recipient =>
                mapping(uint256 amount =>
                    mapping(uint256 fee =>
                        mapping(uint256 deadline =>
                            mapping(uint256 requestId =>
                                address))))))) authorizedRecipients;

    // External functions

    function transfer(
        IERC20 token,
        address recipient,
        uint256 amount,
        uint256 fee,
        uint256 deadline,
        uint256 requestId
    ) external {
        address r = authorizedRecipients[msg.sender][token][recipient][amount][fee][deadline][requestId];
        if (r != address(0)) recipient = r;
        require(token.transferFrom(msg.sender, recipient, amount));
    }

    function advanceTransfer(
        address appContract,
        IERC20 token,
        address recipient,
        uint256 amount,
        uint256 fee,
        uint256 deadline,
        uint256 requestId
    ) external {
        require(block.timestamp < deadline);
        require(
            authorizedRecipients[appContract][token][recipient][amount][fee][deadline][requestId] == address(0)
        );
        authorizedRecipients[appContract][token][recipient][amount][fee][deadline][requestId] = msg.sender;
        require(token.transferFrom(msg.sender, recipient, amount - fee));
    }
}
