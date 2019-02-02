// Require MNEMONIC and INFURA_API_KEY
require("dotenv").config();
// Creates a connection with a wallet
const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");

module.exports = {
  networks: {
    // Development setting
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    // Kovan test network setting
    kovan: {
      provider: () => {
        // Rebuilds the wallet
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        );
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  contracts_build_directory: path.join(__dirname, "src/build/contracts"),
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
