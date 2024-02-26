import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('NFTMarketplace', () => {
  let NFTMarketplace;
  let nftMarketplace;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFTMarketplaceFactory = await ethers.getContractFactory('NFTMarketplace');
    nftMarketplace = await NFTMarketplaceFactory.deploy('MyNFT', 'NFT');
    await nftMarketplace.deployed();
  });

  it('should mint new NFT', async () => {
    await expect(nftMarketplace.connect(owner).mint())
      .to.emit(nftMarketplace, 'NFTMinted')
      .withArgs(owner.address, 0);

    const balance = await nftMarketplace.balanceOf(owner.address);
    expect(balance).to.equal(1);
  });

  it('should list NFT for sale', async () => {
    await nftMarketplace.connect(owner).mint();
    const tokenId = 0;
    const price = ethers.utils.parseEther('1');

    await expect(nftMarketplace.connect(owner).listForSale(tokenId, price))
      .to.emit(nftMarketplace, 'NFTListed')
      .withArgs(tokenId, price);

    const listingPrice = await nftMarketplace.getListingPrice(tokenId);
    expect(listingPrice).to.equal(price);
  });

  it('should allow user to buy NFT', async () => {
    await nftMarketplace.connect(owner).mint();
    const tokenId = 0;
    const price = ethers.utils.parseEther('1');

    await nftMarketplace.connect(owner).listForSale(tokenId, price);

    await expect(nftMarketplace.connect(addr1).buyNFT(tokenId, { value: price }))
      .to.emit(nftMarketplace, 'NFTSold')
      .withArgs(addr1.address, owner.address, tokenId, price);

    const newOwner = await nftMarketplace.ownerOf(tokenId);
    expect(newOwner).to.equal(addr1.address);
  });

  it('should revert if not the owner tries to list NFT for sale', async () => {
    await nftMarketplace.connect(owner).mint();
    const tokenId = 0;
    const price = ethers.utils.parseEther('1');

    await expect(nftMarketplace.connect(addr1).listForSale(tokenId, price))
      .to.be.revertedWith('Not the owner of the NFT');
  });
});
