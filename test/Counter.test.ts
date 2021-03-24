import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Counter } from "../typechain";

describe("Counter", () => {
  let counter: Counter;

  beforeEach(async () => {
    const { Counter } = await deployments.fixture(["Counter"]);
    counter = <Counter>await ethers.getContractAt("Counter", Counter.address);

    const initialCount = await counter.getCount();

    expect(initialCount).to.eq(0);
    expect(counter.address).to.properAddress;
  });

  describe("count up", async () => {
    it("should count up", async () => {
      await counter.countUp();
      let count = await counter.getCount();
      expect(count).to.eq(1);
    });
  });

  describe("count down", async () => {
    it("should fail", async () => {
      const tx = counter.countDown();
      await expect(tx).to.be.revertedWith("Uint256 underflow");
    });

    it("should count down", async () => {
      await counter.countUp();
      await counter.countDown();
      const count = await counter.getCount();
      expect(count).to.eq(0);
    });
  });
});
