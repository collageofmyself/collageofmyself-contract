# Collage of Myself

## Smart Contract Information

This smart contract is using the ERC721 standard

### Deployment information

This contract is deployed on Polygon Blockchhain at the address 0xfdea628f49897c49a8d7824ab286e236e42d4f8f

The bytecode deployed on Polygon Mainnet and Mumbai match 1:1 the contracts found in contractsDeploy/CollageOfMyself_polygon.sol

### Additional public function:

- setPublicUsername() Allow holders to register a name or username with their wallet address
- walletOfOwner() List all nfts that a given address hold
- publicUsernameOfOwner() Display the name or username of a given address
- isWhitelisted() true/false if the address is whitelisted for transfer fee
- validateTransfer() Confirm if the transfer between two address is subject to transfer fee

## Hardhat Testing

This repository is build with Hardhat testing in mind, you can compile, run test and verify coverage test.
[Hardhat Documentation](https://hardhat.org/getting-started/)

### Install Hardhat Dependencies

```commandline
npm install
```

#### Run all tests with Hardhat

```commandline
npx hardhat test
```

#### Run coverage test

```commandline
npx hardhat coverage
```

## Foundry (Forge and Cast)

We started writting test with Foundry as well... (still in progress)

[Foundry Documentation](https://book.getfoundry.sh/index.html)

### Install Forge Dependencies


```commandline
forge install https://github.com/foundry-rs/forge-std
```


