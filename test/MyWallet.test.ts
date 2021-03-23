import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { MyToken, MyWallet } from "../typechain";

describe("MyWallet", () => {
  let myWallet: MyWallet;
  let myToken: MyToken;

  beforeEach(async () => {
    await deployments.fixture(["MyToken", "MyWallet"]);

    // Note: ether.getCountract() is a better way to do that but it's failing
    const MyToken = await deployments.get("MyToken");
    myToken = <MyToken>await ethers.getContractAt("MyToken", MyToken.address);

    // Note: ether.getCountract() is a better way to do that but it's failing
    const MyWallet = await deployments.get("MyWallet");
    myWallet = <MyWallet>await ethers.getContractAt("MyWallet", MyWallet.address);

    await myToken.mint(parseEther("1000"));
    await myToken.approve(myWallet.address, ethers.constants.MaxUint256);
  });

  it("should deposit", async () => {
    const balanceBefore = await myToken.balanceOf(myWallet.address);
    expect(balanceBefore).to.eq(0);

    const amountToDeposit = parseEther("10");
    await myWallet.deposit(myToken.address, amountToDeposit);

    const balanceAfter = await myToken.balanceOf(myWallet.address);
    expect(balanceAfter).to.eq(amountToDeposit);
  });

  it("should withdraw", async () => {
    const amount = parseEther("5");
    await myWallet.deposit(myToken.address, amount);
    const balanceBefore = await myToken.balanceOf(myWallet.address);
    expect(balanceBefore).to.eq(amount);

    await myWallet.withdrawAll(myToken.address);

    const balanceAfter = await myToken.balanceOf(myWallet.address);
    expect(balanceAfter).to.eq(0);
  });
});
