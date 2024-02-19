import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe('MyNFT Contract', function () {
  async function deployTokenFixture() {
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    const [owner, addr1, addr2] = await ethers.getSigners(); // Destructure the array to get the owner
    return { myNFT, owner, addr1, addr2 };
  }

  it('Should Mint a new token', async function () {
    const { myNFT, owner } = await loadFixture(deployTokenFixture);

    // Call the safeMint function
    const mintTx = await myNFT.safeMint(owner.address, 'https://gateway.pinata.cloud/ipfs/QmTuKZNLMwRh6bwE9GzRmbHrHdYTkfPmqehNJEeaDt9G23');
    await mintTx.wait();

    // Check the balance of the owner after minting
    expect(await myNFT.balanceOf(owner.address)).to.equal(1);
  });

  it('Should set the owner of the token right', async function () {
    const { myNFT, owner, addr1 } = await loadFixture(deployTokenFixture);

     // Call the safeMint function
     const mintTx = await myNFT.safeMint(addr1.address, 'https://gateway.pinata.cloud/ipfs/QmTuKZNLMwRh6bwE9GzRmbHrHdYTkfPmqehNJEeaDt9G23');
     await mintTx.wait();

     // Check the balance of the owner after minting
    expect(await myNFT.balanceOf(addr1.address)).to.equal(1);

     // Check the owner of the token
    const tokenId = 0; // Adjust the tokenId based on your contract logic
    expect(await myNFT.ownerOf(tokenId)).to.equal(addr1.address);
  })
});
