import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SaveERC20__factory } from "../typechain-types";

describe("SaveERC20", function () {
  let owner;

  async function deployContract() {
    const [deployer] = await ethers.getSigners();
    owner = deployer;
    const SaveERC20ContractFactory = (await ethers.getContractFactory(
      "SaveERC20",
      deployer
    )) as SaveERC20__factory;

    // Deploying the contract with a mock ERC20 token address for testing purposes
    const saveERC20Contract = await SaveERC20ContractFactory.deploy(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );

    return { saveERC20Contract, owner };
  }

  it("Should be able to make a successful deposit", async function () {
    const { saveERC20Contract, owner } = await loadFixture(deployContract);
  
    // Approve the contract to spend some tokens (this is specific to ERC20 tokens)
    const savingToken = await saveERC20Contract.savingToken; // Access as a property, not a function
    const token = await ethers.getContractAt("IERC20", savingToken, owner);
    await token.approve(saveERC20Contract.address, ethers.utils.parseEther("1000"));
  
    // Make a deposit of 100 tokens
    const depositAmount = ethers.utils.parseEther("100");
    await expect(saveERC20Contract.deposit(depositAmount))
      .to.emit(saveERC20Contract, "SavingSuccessful")
      .withArgs(owner.address, depositAmount);
  
    // Check user savings after deposit
    const userSavingsAfterDeposit = await saveERC20Contract.checkUserBalance(owner.address);
    expect(userSavingsAfterDeposit).to.equal(depositAmount);
  });
  
  // Add more test cases as needed...
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
