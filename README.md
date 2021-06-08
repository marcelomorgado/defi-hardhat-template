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

Note: Where `<network>` is one of the networks configured in `hadhat.config.ts` (By default: `hardhat`, `mainnet`, `goerli` and `bsc`).

## Test

```bash
yarn test
```

Note: By default the tests will run against a forked ethereum mainnet.

## Deploy & Verify

```bash
yarn <network>:deploy
yarn <network>:verify
```

Note: Etherscan (or BSCScan) API is required for verification.

## TODO

- Upgradable contracts
- Etherscan verify (for implementation and proxy contracts);
