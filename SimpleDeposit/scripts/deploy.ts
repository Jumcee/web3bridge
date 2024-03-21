import { ethers } from "hardhat";

async function main() {
  const SimpleDeposit = await ethers.getContractFactory("SimpleDeposit");
  const simpleDeposit= await SimpleDeposit.deploy();


  console.log(`${simpleDeposit} deployed to address: ${simpleDeposit.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
