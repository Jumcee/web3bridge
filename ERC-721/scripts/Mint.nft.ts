require('dotenv').config();
const ethers = require('ether');

const API_KEY = process.env.API_KEY;
const provider = new ethers.AlchemyProvider('sepolia', API_KEY)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
console.log(JSON.stringify(contract.abi));