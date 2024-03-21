// import { ethers } from "hardhat";

// async function main() {
//     const [deployer] = await ethers.getSigners();

//     const MyContractFactory = await ethers.getContractFactory("MyContractFactory");
//     const myContractFactory = await MyContractFactory.deploy();

//     console.log("MyContractFactory deployed to:", myContractFactory.target);
// }

// main();


// import { ethers } from 'hardhat';
// import { NFTFactory } from '../typechain';



import { ethers } from 'hardhat';
import { NFTFactory, NFTSocialMedia, NFTSocial } from './typechain';

async function main() {
  // Deploy NFTFactory
  const NFTFactoryContract = await ethers.getContractFactory('NFTFactory');
  const nftFactory = await NFTFactoryContract.deploy();
  //await nftFactory.deployed();
  console.log('NFTFactory deployed to:', nftFactory.target);

  // Deploy NFTSocialMedia
  const NFTSocialMediaContract = await ethers.getContractFactory('NFTSocialMedia');
  const nftSocialMedia = await NFTSocialMediaContract.deploy();
  //await nftSocialMedia.deployed();
  console.log('NFTSocialMedia deployed to:', nftSocialMedia.target);

  // Deploy NFTSocial
  const NFTSocialContract = await ethers.getContractFactory('NFTSocial');
  const nftSocial = await NFTSocialContract.deploy(nftFactory.target, nftSocialMedia.target);
  //await nftSocial.deployed();
  console.log('NFTSocial deployed to:', nftSocial.target);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
