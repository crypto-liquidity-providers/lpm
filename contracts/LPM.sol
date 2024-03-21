// SPDX-License-Identifier: GPL-3.0-only

pragma solidity 0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/// @notice Liquidity Provider Marketplace
contract LPM {

    // Events

    event AdvanceTransferred(
        address indexed appContract,
        IERC20 indexed token,
        address indexed recipient,
        uint256 amount,
        uint256 fee,
        uint256 deadline,
        uint256 requestId
    );

    // Errors

    error ERC20TransferFailed();
    error DeadlineElapsed();
    error AdvanceAlreadyTransferred();

    // State variables

    mapping(bytes32 key => address) authorizedRecipients;

    // External functions

    function transfer(
        IERC20 token,
        address recipient,
        uint256 amount,
        uint256 fee,
        uint256 deadline,
        uint256 requestId
    ) external {
        address appContract = msg.sender;

        bytes32 key = _generateKey(
            appContract,
            token,
            recipient,
            amount,
            fee,
            deadline,
            requestId
        );

        address authorizedRecipient = authorizedRecipients[key];

        if (authorizedRecipient != address(0)) {
            recipient = authorizedRecipient;
        }

        _transferFromMessageSender(token, recipient, amount);
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
        if (block.timestamp >= deadline) {
            revert DeadlineElapsed();
        }

        bytes32 key = _generateKey(
            appContract,
            token,
            recipient,
            amount,
            fee,
            deadline,
            requestId
        );

        if (authorizedRecipients[key] != address(0)) {
            revert AdvanceAlreadyTransferred();
        }

        authorizedRecipients[key] = msg.sender;

        _transferFromMessageSender(token, recipient, amount - fee);

        emit AdvanceTransferred(
            appContract,
            token,
            recipient,
            amount,
            fee,
            deadline,
            requestId
        );
    }

    function _generateKey(
        address appContract,
        IERC20 token,
        address recipient,
        uint256 amount,
        uint256 fee,
        uint256 deadline,
        uint256 requestId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            appContract,
            token,
            recipient,
            amount,
            fee,
            deadline,
            requestId
        ));
    }

    function _transferFromMessageSender(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        if (!token.transferFrom(msg.sender, to, amount))
            revert ERC20TransferFailed();
    }
}
