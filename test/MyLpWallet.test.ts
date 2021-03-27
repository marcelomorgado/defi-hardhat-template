import { parseEther } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import {
  MyToken,
  MyLpWallet,
  IUniswapV2Router02,
  IUniswapV2Pair__factory,
  IUniswapV2Router02__factory,
  IUniswapV2Factory,
  IUniswapV2Factory__factory,
} from "../typechain";
import erc20 from "@studydefi/money-legos/erc20";

// TODO: Get from money-legos
const UNISWAP_V2_ROUTER02_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const UNISWAP_V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

describe("MyLpWallet", () => {
  let wallet: SignerWithAddress;
  let myLpWallet: MyLpWallet;
  let myToken: MyToken;
  let uniswapRouter: IUniswapV2Router02;
  let uniswapFactory: IUniswapV2Factory;

  beforeEach(async () => {
    [wallet] = await ethers.getSigners();
    const { MyToken, MyLpWallet } = await deployments.fixture(["MyToken", "MyLpWallet"]);

    myToken = <MyToken>await ethers.getContractAt("MyToken", MyToken.address);
    myLpWallet = <MyLpWallet>await ethers.getContractAt("MyLpWallet", MyLpWallet.address);
    uniswapRouter = IUniswapV2Router02__factory.connect(UNISWAP_V2_ROUTER02_ADDRESS, wallet);
    uniswapFactory = IUniswapV2Factory__factory.connect(UNISWAP_V2_FACTORY_ADDRESS, wallet);

    await myToken.mint(parseEther("1000"));
    await myToken.approve(myLpWallet.address, ethers.constants.MaxUint256);
  });

  it("should add liquidity", async () => {
    const tx = await myLpWallet.addLiquidity(parseEther("100"), { value: parseEther("10") });
    expect(tx).to.emit(myLpWallet, "LiquidityAdded");
    const pairAddress = await uniswapFactory.getPair(myToken.address, erc20.weth.address);
    const uniswapPair = IUniswapV2Pair__factory.connect(pairAddress, wallet);
    expect(await uniswapPair.totalSupply()).eq(
      (await uniswapPair.balanceOf(myLpWallet.address)).add(await uniswapPair.MINIMUM_LIQUIDITY())
    );
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
