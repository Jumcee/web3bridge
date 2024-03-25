import { expect } from "chai";
import { ethers } from "hardhat";

describe("SavingsContract", function () {
  let SavingsContract;
  let savingsContract;
  let owner;
  let addr1;
  let addr2;
  let Token;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SavingsContract"); // Replace with the actual name of your ERC20 token contract
    const token = await Token.deploy("token.target");
    await token.deployed();

    SavingsContract = await ethers.getContractFactory("SavingsContract");
    savingsContract = await SavingsContract.deploy(token.target);
    await savingsContract.deployed();
  });

  it("Should deposit ERC20 tokens", async function () {
    const depositAmount = ethers.utils.parseEther("10");
    await Token.connect(addr1).approve(savingsContract.address, depositAmount);
    await expect(savingsContract.connect(addr1).deposit(depositAmount))
      .to.emit(savingsContract, "Deposit")
      .withArgs(addr1.address, depositAmount);

    const balance = await savingsContract.getBalance();
    expect(balance).to.equal(depositAmount);
  });

  it("Should withdraw ERC20 tokens", async function () {
    const depositAmount = ethers.utils.parseEther("10");
    await Token.connect(addr1).approve(savingsContract.address, depositAmount);
    await savingsContract.connect(addr1).deposit(depositAmount);

    const withdrawAmount = ethers.utils.parseEther("5");
    await expect(savingsContract.connect(addr1).withdraw(withdrawAmount))
      .to.emit(savingsContract, "Withdrawal")
      .withArgs(addr1.address, withdrawAmount);

    const balance = await savingsContract.getBalance();
    expect(balance).to.equal(depositAmount - withdrawAmount);
  });

  it("Should not allow non-owners to withdraw all", async function () {
    await expect(savingsContract.connect(addr1).withdrawAll()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should withdraw all ERC20 tokens by owner", async function () {
    const depositAmount = ethers.utils.parseEther("10");
    await Token.connect(addr1).approve(savingsContract.address, depositAmount);
    await savingsContract.connect(addr1).deposit(depositAmount);

    await expect(savingsContract.connect(owner).withdrawAll())
      .to.emit(savingsContract, "Withdrawal")
      .withArgs(owner.address, depositAmount);

    const balance = await savingsContract.getBalance();
    expect(balance).to.equal(0);
  });
});
