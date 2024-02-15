import { ethers } from "hardhat";
import { expect } from "chai";

describe("SaveEther", () => {
  let saveEther;

  before(async () => {
    const SaveEther = await ethers.getContractFactory("SaveEther");
    saveEther = await SaveEther.deploy();
    await saveEther.deployed();
  });

  it("should deposit funds successfully", async () => {
    const depositAmount = ethers.utils.parseEther("1"); // 1 ETH as an example

    const tx = await saveEther.deposit({ value: depositAmount });
    await tx.wait();

    const userBalance = await saveEther.checkSavings(await ethers.provider.getSigner(0).getAddress());
    expect(userBalance).to.equal(depositAmount);
  });

  it("should withdraw funds successfully", async () => {
    const depositAmount = ethers.utils.parseEther("1"); // 1 ETH as an example

    await saveEther.deposit({ value: depositAmount });

    const tx = await saveEther.withdraw();
    await tx.wait();

    const userBalance = await saveEther.checkSavings(await ethers.provider.getSigner(0).getAddress());
    expect(userBalance).to.equal(0);
  });

  it("should check the contract balance", async () => {
    const contractBalance = await saveEther.checkContractBal();
    expect(contractBalance).to.equal(0);
  });

  it("should send out savings to another address", async () => {
    const depositAmount = ethers.utils.parseEther("1"); // 1 ETH as an example

    await saveEther.deposit({ value: depositAmount });

    const receiver = ethers.Wallet.createRandom().address;
    const sendAmount = ethers.utils.parseEther("0.5"); // 0.5 ETH as an example

    const tx = await saveEther.sendOutSaving(receiver, sendAmount);
    await tx.wait();

    const userBalance = await saveEther.checkSavings(await ethers.provider.getSigner(0).getAddress());
    expect(userBalance).to.equal(depositAmount - sendAmount);

    const receiverBalance = await saveEther.checkSavings(receiver);
    expect(receiverBalance).to.equal(sendAmount);
  });
});
