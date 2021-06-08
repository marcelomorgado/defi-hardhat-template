# DeFi Hardhat Template

[![Tests](https://github.com/marcelomorgado/defi-hardhat-template/actions/workflows/main.yml/badge.svg)](https://github.com/marcelomorgado/defi-hardhat-template/actions/workflows/main.yml)

This is a Hardhat project template focused on the DeFi smart contracts development.

## Installation

```bash
yarn
```

## Setup

```bash
cp .env.example .env.<network>
code .env.<network>
```

Note: Where `<network>` is one of the networks configured in `hadhat.config.ts` (By default: `hardhat`, `mainnet`, `goerli` or `bsc`).

## Test

```bash
yarn compile
yarn test
```

Note: By default the tests will run against a forked Ethereum mainnet.

### Typechain

The `hardhat` will generates `typechain` code for contracts under `contracts/` folder. You can also have `typechain` code for external contracts (for instance, tests another DeFi protocols), you only need to put their ABIs inside of the `typechain/abi` and run `yarn compile`.

## Deploy & Verify

```bash
yarn <network>:deploy
yarn <network>:verify
```

Note: Etherscan (or BSCScan) API is required for verification.
