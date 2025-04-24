const config = require("./config/config");
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      hardfork: "prague",
    },
    sepolia: config.sepolia
  },
  etherscan: {
    apiKey: config.etherscan.apiKey,
  },
};
