# DeFi Hardhat Template

[![Tests](https://github.com/marcelomorgado/defi-hardhat-template/actions/workflows/main.yml/badge.svg)](https://github.com/marcelomorgado/defi-hardhat-template/actions/workflows/main.yml)

This is a Hardhat project template focused on the DeFi smart contracts development.

## :floppy_disk: Installation

```bash
yarn
```

## :electric_plug: Setup

### Parameters

```bash
cp .env.example .env.<network>
code .env.<network>
```

Note: Where `<network>` is one of the networks configured in `hadhat.config.ts` (By default: `hardhat`, `mainnet`, `goerli` or `bsc`).

### Typechain

The `hardhat` will generates `typechain` code for contracts under `contracts/` folder. You can also have `typechain` code for external contracts (for instance, tests another DeFi protocols), you only need to put their ABIs inside of the `typechain/abi` and run `yarn compile`.

## :toolbox: Test

```bash
yarn compile
yarn test
```

Note: By default the tests will run against a forked Ethereum mainnet.

## :chains: Deploy & Verify

```bash
yarn <network>:deploy
yarn <network>:verify
```

Note: Etherscan (or BSCScan) API KEY is required for verification.
