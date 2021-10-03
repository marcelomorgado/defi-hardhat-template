import { parseEther } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain";

describe("MyToken", () => {
  let wallet: SignerWithAddress;
  let myToken: MyToken;

  beforeEach(async () => {
    [wallet] = await ethers.getSigners();
    const { MyToken } = await deployments.fixture(["MyToken"]);
    myToken = MyToken__factory.connect(MyToken.address, wallet);

    expect(myToken.address).to.properAddress;
  });

  it("should mint", async () => {
    expect(await myToken.totalSupply()).to.eq(0);
    const toMint = parseEther("1000");
    await myToken.mint(toMint);
    expect(await myToken.totalSupply()).to.eq(toMint);
  });
});
