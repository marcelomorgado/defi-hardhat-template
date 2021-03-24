import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { MyToken, MyLpWallet } from "../typechain";

describe("MyLpWallet", () => {
  let myLpWallet: MyLpWallet;
  let myToken: MyToken;

  beforeEach(async () => {
    const { MyToken, MyLpWallet } = await deployments.fixture(["MyToken", "MyLpWallet"]);

    myToken = <MyToken>await ethers.getContractAt("MyToken", MyToken.address);
    myLpWallet = <MyLpWallet>await ethers.getContractAt("MyLpWallet", MyLpWallet.address);

    await myToken.mint(parseEther("1000"));
    await myToken.approve(myLpWallet.address, ethers.constants.MaxUint256);
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
