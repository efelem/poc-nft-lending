# Sample Hardhat Project

This project demonstrates a basic NFTCollateralLoan smart contract project. It uses Hardhat and was set up with hardhat init. 
It comes with a sample NFTCollateralLoan contract, a test for that contract, and a Hardhat Ignition module that deploys that contract and associated Mock contract to get things running on testnet.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/NFTCollateralLoan.ts --network linea_goerli  --deployment-id linea-deployment
```

The output should look like : 

```
Deployed Addresses

NFTCollateralLoanModule#ChubbitMock - 0xA01EBEfca89fcc414E9A4B7784E0631FD05a1C23
NFTCollateralLoanModule#DaiMock - 0xeB76fE76c852674A186577Cd19cE7C9CbA5B607A
NFTCollateralLoanModule#DeGodsMock - 0xaF3025761A8e187A7a96DA4bbb1a4D21B4B78452
NFTCollateralLoanModule#MockaverseMock - 0xFfFEC81427EE2450A5f54876Ae1580C39e308B5F
NFTCollateralLoanModule#NFTCollateralLoan - 0x5A2B397C3Afe2C42e8CAD7F0a5a36D89667D3b18
```

You can then edit the `client/scripts/get_nft_data.js` line 

```
const tokenContract = "0xA01EBEfca89fcc414E9A4B7784E0631FD05a1C23";
```

With one of the mock nft contract deployed. The script uses the realContractAddress member added in the NFT mock contract to recover data associated with the real nft on the mainnet. This will allow us to simulate existing NFTs. Crucial to get good information from the NFT api. 