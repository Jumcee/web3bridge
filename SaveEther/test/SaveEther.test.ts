import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SaveEther__factory } from "../typechain-types";

describe("SaveEther", function () {
  let owner;

  async function deployContract() {
    const [deployer] = await ethers.getSigners();
    owner = deployer;
    const SaveEtherContractFactory = await ethers.getContractFactory("SaveEther");
    const saveEtherContract = await SaveEtherContractFactory.deploy();
    return { saveEtherContract, owner };
  }

  it("Should be able to make a successful deposit", async function () {
    const { saveEtherContract, owner } = await loadFixture(deployContract);
  
    // Make a deposit of 100 wei
    const depositAmount = 100;
    await expect(saveEtherContract.deposit({ value: depositAmount }))
      .to.emit(saveEtherContract, "SavingSuccessful")
      .withArgs(owner.address, depositAmount);
  
    // Check user savings after deposit
    const userSavingsAfterDeposit = await saveEtherContract.getUserSavings(owner.address);
    expect(userSavingsAfterDeposit).to.equal(depositAmount);
  });
});




  

  //   it("Should toggle isDone status", async function () {
  //     const { todoContract } = await loadFixture(deployContract);
  //     await todoContract.createTODO("Title", "Description");
  
  //     // Get the todos and ensure it's marked as not done initially
  //     const todosBeforeToggle = await todoContract.getTODO();
  //     expect(todosBeforeToggle[0].isDone).to.equal(false);
  
  //     // Toggle isDone status
  //     await todoContract.toggleIsDone(0);
  
  //     // Get the todos again and ensure it's marked as done after toggling
  //     const todosAfterToggle = await todoContract.getTODO();
  //     expect(todosAfterToggle[0].isDone).to.equal(true);
  //   });
  

  //   it("Should update a todo", async function () {
  //     const { todoContract } = await loadFixture(deployContract);
  //     await todoContract.createTODO("Title", "Description");
  //     await todoContract.updateTodo(0, "New Title", "New Description");
  //     const todos = await todoContract.getTODO();
  //     expect(todos[0].title).to.equal("New Title");
  //     expect(todos[0].description).to.equal("New Description");
  //   });

  //   it("Should delete a todo", async function () {
  //     const { todoContract } = await loadFixture(deployContract);
  //     await todoContract.createTODO("Title", "Description");
  //     await todoContract.deleteTodo(0);
  //     const todos = await todoContract.getTODO();
  //     expect(todos.length).to.equal(0);
  //   });
  // });
