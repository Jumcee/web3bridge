import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { TodoContract__factory } from "../typechain-types";

describe("TodoContract", function () {
  async function deployContract() {
    const TodoContractFactory = await ethers.getContractFactory("TodoContract");
    const todoContract = await TodoContractFactory.deploy();
    return { todoContract};
  }


    it("Should be able to create a todo", async function () {
      const { todoContract } = await loadFixture(deployContract);
      await todoContract.createTODO("Title", "Description");
      const todos = await todoContract.getTODO();
      expect(todos.length).to.equal(1);
      expect(todos[0].title).to.equal("Title");
      expect(todos[0].description).to.equal("Description");
      expect(todos[0].isDone).to.equal(false);
    });

    it("Should toggle isDone status", async function () {
      const { todoContract } = await loadFixture(deployContract);
      await todoContract.createTODO("Title", "Description");
  
      // Get the todos and ensure it's marked as not done initially
      const todosBeforeToggle = await todoContract.getTODO();
      expect(todosBeforeToggle[0].isDone).to.equal(false);
  
      // Toggle isDone status
      await todoContract.toggleIsDone(0);
  
      // Get the todos again and ensure it's marked as done after toggling
      const todosAfterToggle = await todoContract.getTODO();
      expect(todosAfterToggle[0].isDone).to.equal(true);
    });
  

    it("Should update a todo", async function () {
      const { todoContract } = await loadFixture(deployContract);
      await todoContract.createTODO("Title", "Description");
      await todoContract.updateTodo(0, "New Title", "New Description");
      const todos = await todoContract.getTODO();
      expect(todos[0].title).to.equal("New Title");
      expect(todos[0].description).to.equal("New Description");
    });

    it("Should delete a todo", async function () {
      const { todoContract } = await loadFixture(deployContract);
      await todoContract.createTODO("Title", "Description");
      await todoContract.deleteTodo(0);
      const todos = await todoContract.getTODO();
      expect(todos.length).to.equal(0);
    });
  });
