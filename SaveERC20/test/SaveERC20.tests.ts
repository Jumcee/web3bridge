import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20 Test", function () {
  async function deploySaveERC20Fixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Use MockERC20 contract for testing purposes
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await MockERC20.deploy();

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(mockERC20.address);

    // Mint some tokens for testing
    await mockERC20.mint(owner.address, 1000);

    return {
      saveERC20,
      owner,
      addr1,
      addr2,
      mockERC20,
    };
  }

  describe("Basic Functions", () => {
    it("should deposit funds successfully", async () => {
      const { saveERC20, owner, depositAmount } = await loadFixture(deploySaveERC20Fixture);
      const validDepositAmount = ethers.utils.parseEther("1");

      // Approve spending for MockERC20
      await saveERC20.mockERC20.approve(saveERC20.address, validDepositAmount);

      await saveERC20.deposit(validDepositAmount);

      const userBalance = await saveERC20.checkUserBalance(owner.address);
      expect(userBalance).to.equal(validDepositAmount);
    });

    it("should withdraw funds successfully", async () => {
      const { saveERC20, owner, depositAmount, mockERC20 } = await loadFixture(deploySaveERC20Fixture);
      const validDepositAmount = ethers.utils.parseEther("1");

      // Approve spending and deposit
      await saveERC20.mockERC20.approve(saveERC20.address, validDepositAmount);
      await saveERC20.deposit(validDepositAmount);

      const initialBalance = await mockERC20.balanceOf(owner.address);

      await saveERC20.withdraw(validDepositAmount);

      const userBalance = await saveERC20.checkUserBalance(owner.address);
      const finalBalance = await mockERC20.balanceOf(owner.address);

      expect(userBalance).to.equal(0);
      expect(finalBalance).to.equal(initialBalance.add(validDepositAmount));
    });

    it("should not allow insufficient withdrawals", async () => {
      const { saveERC20, owner, depositAmount } = await loadFixture(deploySaveERC20Fixture);
      const insufficientAmount = ethers.utils.parseEther("2"); // More than deposited

      // Approve spending and deposit
      await saveERC20.mockERC20.approve(saveERC20.address, depositAmount);
      await saveERC20.deposit(depositAmount);

      await expect(saveERC20.withdraw(insufficientAmount)).to.be.revertedWith("insufficient funds");
    });
  });
});