import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    const MyContractFactory = await ethers.getContractFactory("MyContractFactory");
    const myContractFactory = await MyContractFactory.deploy();

    console.log("MyContractFactory deployed to:", myContractFactory.target);
}

main();
