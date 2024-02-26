import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTMarketplace } from "../typechain";

describe("NFTMarketplace", () => {
  let nftMarketplace: NFTMarketplace;
  let owner: any;
  let buyer: any;

  beforeEach(async () => {
    [owner, buyer] = await ethers.getSigners();

    const NFTMarketplaceFactory = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = (await NFTMarketplaceFactory.deploy("MyNFTMarket", "NFTM")) as NFTMarketplace;
    await nftMarketplace.deployed();
  });

  it("should mint a new NFT", async () => {
    await nftMarketplace.connect(owner).mint();
    const tokenId = 0; // Assuming the first tokenId is 0

    const ownerOfToken = await nftMarketplace.ownerOf(tokenId);
    expect(ownerOfToken).to.equal(owner.address);

    const listingPrice = await nftMarketplace.getListingPrice(tokenId);
    expect(listingPrice).to.equal(0); // Listing price should be 0 initially
  });

  it("should list NFT for sale", async () => {
    await nftMarketplace.connect(owner).mint();
    const tokenId = 0;
    const price = ethers.utils.parseEther("1");

    await nftMarketplace.connect(owner).listForSale(tokenId, price);

    const listingPrice = await nftMarketplace.getListingPrice(tokenId);
    expect(listingPrice).to.equal(price);
  });

  it("should buy NFT", async () => {
    const initialBalanceOwner = await owner.getBalance();
    const initialBalanceBuyer = await buyer.getBalance();

    await nftMarketplace.connect(owner).mint();
    const tokenId = 0;
    const price = ethers.utils.parseEther("1");

    await nftMarketplace.connect(owner).listForSale(tokenId, price);

    await expect(nftMarketplace.connect(buyer).buyNFT(tokenId, { value: price }))
      .to.emit(nftMarketplace, "NFTSold")
      .withArgs(buyer.address, owner.address, tokenId, price);

    const newOwner = await nftMarketplace.ownerOf(tokenId);
    expect(newOwner).to.equal(buyer.address);

    const newListingPrice = await nftMarketplace.getListingPrice(tokenId);
    expect(newListingPrice).to.equal(0);

    const finalBalanceOwner = await owner.getBalance();
    const finalBalanceBuyer = await buyer.getBalance();

    // Check if the funds were transferred correctly
    const expectedBalanceOwner = initialBalanceOwner.add(price);
    const expectedBalanceBuyer = initialBalanceBuyer.sub(price);

    expect(finalBalanceOwner).to.equal(expectedBalanceOwner);
    expect(finalBalanceBuyer).to.equal(expectedBalanceBuyer);
  });

  it("should withdraw funds", async () => {
    const initialBalanceOwner = await owner.getBalance();
    const amountToSend = ethers.utils.parseEther("1");

    await owner.sendTransaction({ to: nftMarketplace.address, value: amountToSend });

    const contractBalanceBefore = await ethers.provider.getBalance(nftMarketplace.address);
    expect(contractBalanceBefore).to.equal(amountToSend);

    await nftMarketplace.connect(owner).withdrawFunds();

    const finalBalanceOwner = await owner.getBalance();
    const contractBalanceAfter = await ethers.provider.getBalance(nftMarketplace.address);
    expect(finalBalanceOwner).to.be.above(initialBalanceOwner);
    expect(contractBalanceAfter).to.equal(0);
  });
});
