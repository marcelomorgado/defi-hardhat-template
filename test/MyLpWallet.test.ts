import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { MyToken, MyLpWallet, IUniswapV2Router02 } from "../typechain";
import { abi as IUniswapV2Router02_ABI } from "../artifacts/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json";

const UNISWAP_V2_ROUTER02_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

describe("MyLpWallet", () => {
  let myLpWallet: MyLpWallet;
  let myToken: MyToken;
  let uniswapRouter: IUniswapV2Router02;

  beforeEach(async () => {
    const { MyToken, MyLpWallet } = await deployments.fixture(["MyToken", "MyLpWallet"]);

    myToken = <MyToken>await ethers.getContractAt("MyToken", MyToken.address);
    myLpWallet = <MyLpWallet>await ethers.getContractAt("MyLpWallet", MyLpWallet.address);

    uniswapRouter = <IUniswapV2Router02>await ethers.getContractAt(IUniswapV2Router02_ABI, UNISWAP_V2_ROUTER02_ADDRESS);

    await myToken.mint(parseEther("1000"));
    await myToken.approve(myLpWallet.address, ethers.constants.MaxUint256);
  });

  it("should add liquidity", async () => {
    const tx = await myLpWallet.addLiquidity(parseEther("100"), { value: parseEther("10") });
    expect(tx).to.emit(myLpWallet, "LiquidityAdded");
    // TODO: Compare pairBalance with the Wallet balance
    // TODO: Use the same typechain setup as unitrade-contracts
  });

  it("should deposit", async () => {
    const balanceBefore = await myToken.balanceOf(myLpWallet.address);
    expect(balanceBefore).to.eq(0);

    const amountToDeposit = parseEther("10");
    await myLpWallet.deposit(myToken.address, amountToDeposit);

    const balanceAfter = await myToken.balanceOf(myLpWallet.address);
    expect(balanceAfter).to.eq(amountToDeposit);
  });

  it("should withdraw", async () => {
    const amount = parseEther("5");
    await myLpWallet.deposit(myToken.address, amount);
    const balanceBefore = await myToken.balanceOf(myLpWallet.address);
    expect(balanceBefore).to.eq(amount);

    await myLpWallet.withdrawAll(myToken.address);

    const balanceAfter = await myToken.balanceOf(myLpWallet.address);
    expect(balanceAfter).to.eq(0);
  });
});
