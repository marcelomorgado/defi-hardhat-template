import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import { removeConsoleLog } from "hardhat-preprocessor";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "hardhat-spdx-license-identifier";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "hardhat-tracer";

dotenv.config();

const accounts = process.env.MNEMONIC ? { mnemonic: process.env.MNEMONIC } : undefined;

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: 0,
  },
  preprocess: {
    eachLine: removeConsoleLog(({ network: { name } }) => !["hardhat", "localhost"].includes(name)),
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.PROVIDER_URL!,
        blockNumber: Number(process.env.BLOCK_NUMBER),
      },
    },
    mainnet: {
      url: process.env.PROVIDER_URL!,
      accounts,
    },
    goerli: {
      url: process.env.PROVIDER_URL!,
      accounts,
    },
  },
  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS == "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
