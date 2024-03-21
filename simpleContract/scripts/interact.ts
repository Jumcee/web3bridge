import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    const MyContractFactory = await ethers.getContractFactory("MyContractFactory");
    const myContractFactory = await MyContractFactory.deploy();

    await myContractFactory.createMyContract();

    // Wait for the contract creation event
    const [event] = await myContractFactory.queryFilter("MyContractCreated");
    if (!event || !event.args || event.args.length === 0) {
        throw new Error("Contract creation event not found");
    }

    // Extract the contract address from the event
    const myContractAddress = event.args[0];

    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = MyContract.attach(myContractAddress);

    // Interact with your contract
    await myContract.setData(42);

    console.log("Transaction Hash:", myContract.provider.getTransactionReceipt(myContract.transactionHash));
}

main();
