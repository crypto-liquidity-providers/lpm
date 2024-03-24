import { parseAbi } from "viem";

export const advanceAbi = parseAbi([
    "function withdraw(address token, uint256 amount, uint256 fee, uint256 deadline)",
]);
