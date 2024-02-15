require('dotenv').config();
const ethers = require('ethers');

const API_KEY = process.env.API_KEY;

const provider = new ethers.AlchemyProvider('sepolia', API_KEY)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

const privateKey = process.env.PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0xe34c86A03F17E29F77beeE7c898Adae4dD578006'

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer)
console.log(abi.find((item) => item.name === 'mintNFT'));

// Get the NFT Metadata IPFS URL
const tokenUri = "https://gateway.pinata.cloud/ipfs/QmTuKZNLMwRh6bwE9GzRmbHrHdYTkfPmqehNJEeaDt9G23"

// Call mintNFT function
const mintNFT = async () => {
    let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri)
    await nftTxn.wait()
    console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`)
}

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });