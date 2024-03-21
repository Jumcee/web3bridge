import { expect } from "chai";
import { ethers } from "hardhat";

describe("SimpleDeposit", () => {
  let simpleDeposit: ethers.Contract;
  let signers: ethers.SignerWithAddress[];

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const SimpleDepositFactory = await ethers.getContractFactory("SimpleDeposit");
    simpleDeposit = await SimpleDepositFactory.deploy();
    await simpleDeposit.deployed();
  });

  it("should allow users to deposit funds", async () => {
    const initialBalance = await simpleDeposit.balanceOf(signers[0].address);
    const amountToDeposit = ethers.utils.parseUnits("10", "ether");

    await simpleDeposit.deposit({ value: amountToDeposit, from: signers[0] });

    const updatedBalance = await simpleDeposit.balanceOf(signers[0].address);
    expect(updatedBalance).to.equal(initialBalance.add(amountToDeposit));
  });

  it("should track total deposits", async () => {
    const initialTotalDeposits = await simpleDeposit.totalDeposits();
    const amountToDeposit = ethers.utils.parseUnits("5", "ether");

    await simpleDeposit.deposit({ value: amountToDeposit, from: signers[0] });

    const updatedTotalDeposits = await simpleDeposit.totalDeposits();
    expect(updatedTotalDeposits).to.equal(initialTotalDeposits.add(amountToDeposit));
  });

  it("should allow users to check their balance", async () => {
    const amountToDeposit = ethers.utils.parseUnits("20", "ether");
    await simpleDeposit.deposit({ value: amountToDeposit, from: signers[0] });

    const userBalance = await simpleDeposit.getBalance(signers[0].address);
    expect(userBalance).to.equal(amountToDeposit);
  });

  it("should revert if deposit amount is 0", async () => {
    await expect(
      simpleDeposit.deposit({ value: 0, from: signers[0] })
    ).to.be.revertedWith("Deposit amount must be greater than 0");
  });
});