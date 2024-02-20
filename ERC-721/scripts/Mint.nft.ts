import { ethers } from 'ethers';

require('dotenv').config();

const API_KEY = process.env.API_KEY 
const provider = new ethers.JsonRpcProvider('sepolia', API_KEY);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
console.log(JSON.stringify(contract.abi));

const private_key = process.env.PRIVATE_KEY
const wallet = new ethers.Wallet('private_key', provider);

// Contract ABI Address
const abi: any[] = contract.abi;
const contractAddress: string = "0xCC8412F3067160249E32F969C033869c4F081f94";

// create a contract instance
const myNFTContract = new ethers.Contract(contractAddress, abi, wallet);

console.log(abi.find((item) => item.name === 'safeMint'));

// get the NFT metadata IPFS URL
const tokenURI: string = 'https://gateway.pinata.cloud/ipfs/QmTuKZNLMwRh6bwE9GzRmbHrHdYTkfPmqehNJEeaDt9G23';

// call safeMint function
const mintNFT = async () => {
  try {
    let nftTxn = await myNFTContract.safeMint(wallet, contractAddress, tokenURI);
    await nftTxn.wait();
    console.log(`NFT Minted! Check it out at: https://etherscan.io/tx/${nftTxn.hash}`);
  } catch (error) {
    console.error(error);
  }
};

mintNFT();
