import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    }
  }
};

export default config;
