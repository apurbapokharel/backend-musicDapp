require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "check open wave glad initial trash more exclude cigar ask someone chapter";
module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/bcf7f972ad3f452c89416b8db3c9ccf6", 4)
      },
      network_id: 3,
      skipDryRun: true
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      path: "soljson-v0.5.16+commit.9c3226ce.js",
      version: "0.5.16",
      build: "commit.9c3226ce",
      longVersion: "0.5.16+commit.9c3226ce",
      keccak256: "0x4600bf758fe009e1f50bd11f8bf0be96bd356b0f37be3ee31b55d80a5063b6a9",
      urls: [
        "bzzr://490c3c517413fde92c954ac36932eedd3bf6f62f0fdf9400eea0a21632074cbe"
      ]
    }
  }
}
