import { parseEther } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import {
  MyToken,
  MyLpWallet,
  IUniswapV2Router02,
  IUniswapV2Router02__factory,
  MyToken__factory,
  MyLpWallet__factory,
} from "../typechain";
import erc20 from "@studydefi/money-legos/erc20";
import { factory, router02 } from "@studydefi/money-legos/uniswapV2";
import { Contract } from "ethers";

describe("MyLpWallet", () => {
  let wallet: SignerWithAddress;
  let myLpWallet: MyLpWallet;
  let myToken: MyToken;
  let uniswapRouter: IUniswapV2Router02;
  let uniswapFactory: Contract;

  beforeEach(async () => {
    [wallet] = await ethers.getSigners();
    const { MyToken, MyLpWallet } = await deployments.fixture(["MyToken", "MyLpWallet"]);

    myToken = MyToken__factory.connect(MyToken.address, wallet);
    myLpWallet = MyLpWallet__factory.connect(MyLpWallet.address, wallet);
    uniswapRouter = IUniswapV2Router02__factory.connect(router02.address, wallet);
    uniswapFactory = new ethers.Contract(
      factory.address,
      ["function getPair(address,address) view returns (address)"],
      wallet
    );

    await myToken.mint(parseEther("1000"));
    await myToken.approve(myLpWallet.address, ethers.constants.MaxUint256);
  });

  it("should add liquidity", async () => {
    const tx = await myLpWallet.addLiquidity(parseEther("100"), { value: parseEther("10") });
    expect(tx).to.emit(myLpWallet, "LiquidityAdded");
    const pairAddress = await uniswapFactory.getPair(myToken.address, erc20.weth.address);
    const uniswapPair = new ethers.Contract(
      pairAddress,
      ["function totalSupply() view returns (uint256)", "function balanceOf(address) view returns (uint256)"],
      wallet
    );

    expect(await uniswapPair.totalSupply()).closeTo(
      await uniswapPair.balanceOf(myLpWallet.address),
      // @ts-ignore
      parseEther("0.0001")
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
