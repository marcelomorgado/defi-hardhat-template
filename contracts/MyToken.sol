// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MYT") {}

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }
}
