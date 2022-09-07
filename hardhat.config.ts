import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "hardhat-spdx-license-identifier";
import dotenv from "dotenv";

dotenv.config();

const accounts = process.env.MNEMONIC ? { mnemonic: process.env.MNEMONIC } : undefined;

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: 0,
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
        blockNumber: process.env.BLOCK_NUMBER ? Number(process.env.BLOCK_NUMBER) : undefined,
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
  contractSizer: {
    alphaSort: true,
    runOnCompile: process.env.RUN_CONTRACT_SIZER === "true",
    disambiguatePaths: false,
  },
};

export default config;
