// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "hardhat/console.sol";

contract MyLpWallet is Ownable {
    IUniswapV2Router02 public immutable uniswapRouterV2;
    IERC20 public immutable myToken;

    event LiquidityAdded(uint256 lpTokens);

    constructor(IERC20 _myTokenAddress, IUniswapV2Router02 _uniswapRouterV2) {
        myToken = _myTokenAddress;
        uniswapRouterV2 = _uniswapRouterV2;
    }

    function addLiquidity(uint256 myTokenAmount) public payable onlyOwner {
        myToken.transferFrom(msg.sender, address(this), myTokenAmount);
        myToken.approve(address(uniswapRouterV2), myTokenAmount);

        // Add liquidity
        (, , uint256 lpTokens) = uniswapRouterV2.addLiquidityETH{value: msg.value}(
            address(myToken),
            myTokenAmount,
            0,
            0,
            address(this),
            2**256 - 1
        );

        // Return remaining amounts
        payable(msg.sender).transfer(address(this).balance);
        myToken.transfer(msg.sender, myToken.balanceOf(address(this)));

        assert(myToken.balanceOf(address(this)) == 0);
        assert(address(this).balance == 0);

        emit LiquidityAdded(lpTokens);
    }

    function deposit(address tokenAddress, uint256 amount) public onlyOwner {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    function withdrawAll(address tokenAddress) public onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
