import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { MyToken } from "../typechain";

describe("MyToken", () => {
  let myToken: MyToken;

  beforeEach(async () => {
    await deployments.fixture(["MyToken"]);

    // Note: ether.getCountract() is a better way to do that but it's failing
    const MyToken = await deployments.get("MyToken");
    myToken = <MyToken>await ethers.getContractAt("MyToken", MyToken.address);
    expect(myToken.address).to.properAddress;
  });

  it("should mint", async () => {
    expect(await myToken.totalSupply()).to.eq(0);
    const toMint = parseEther("1000");
    await myToken.mint(toMint);
    expect(await myToken.totalSupply()).to.eq(toMint);
  });
});
