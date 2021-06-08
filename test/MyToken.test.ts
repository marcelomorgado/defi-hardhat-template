import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import hre, { deployments, ethers } from "hardhat";
import { MyToken } from "../typechain";

describe("MyToken", () => {
  let myToken: MyToken;

  beforeEach(async () => {
    const { MyToken } = await deployments.fixture(["MyToken"]);
    myToken = <MyToken>await ethers.getContractAt("MyToken", MyToken.address);
    hre.tracer.nameTags[myToken.address] = "MyToken";

    expect(myToken.address).to.properAddress;
  });

  it("should mint", async () => {
    expect(await myToken.totalSupply()).to.eq(0);
    const toMint = parseEther("1000");
    await myToken.mint(toMint);
    expect(await myToken.totalSupply()).to.eq(toMint);
  });
});
