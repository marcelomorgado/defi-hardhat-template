// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract MyWallet is Ownable {
    function deposit(address tokenAddress, uint256 amount) public onlyOwner {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    function withdrawAll(address tokenAddress) public onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
