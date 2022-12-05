import { parseEther } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import {
  MyToken,
  MyLpWallet,
  IUniswapV2Router02,
  IUniswapV2Router02__factory,
  IUniswapV2Factory,
  IUniswapV2Factory__factory,
  IUniswapV2Pair__factory,
  MyToken__factory,
  MyLpWallet__factory,
} from "../typechain-types";
import { Address } from "../helper";

const { UNISWAP_V2_ROUTER02, UNISWAP_V2_FACTORY, WETH } = Address;

describe("MyLpWallet", () => {
  let wallet: SignerWithAddress;
  let myLpWallet: MyLpWallet;
  let myToken: MyToken;
  let uniswapRouter: IUniswapV2Router02;
  let uniswapFactory: IUniswapV2Factory;

  beforeEach(async () => {
    [wallet] = await ethers.getSigners();
    const { MyToken, MyLpWallet } = await deployments.fixture();

    myToken = MyToken__factory.connect(MyToken.address, wallet);
    myLpWallet = MyLpWallet__factory.connect(MyLpWallet.address, wallet);
    uniswapRouter = IUniswapV2Router02__factory.connect(UNISWAP_V2_ROUTER02, wallet);
    uniswapFactory = IUniswapV2Factory__factory.connect(UNISWAP_V2_FACTORY, wallet);

    await myToken.mint(parseEther("1000"));
    await myToken.approve(myLpWallet.address, ethers.constants.MaxUint256);
  });

  it("should add liquidity", async () => {
    const tx = await myLpWallet.addLiquidity(parseEther("100"), { value: parseEther("10") });
    expect(tx).to.emit(myLpWallet, "LiquidityAdded");
    const pairAddress = await uniswapFactory.getPair(myToken.address, WETH);
    const uniswapPair = IUniswapV2Pair__factory.connect(pairAddress, wallet);
    const balance = await uniswapPair.balanceOf(myLpWallet.address);

    // @ts-ignore
    expect(await uniswapPair.totalSupply()).closeTo(balance, parseEther("0.0001"));
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
