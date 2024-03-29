// Importing necessary modules from Viem and Chai
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

// Describe block for the test suite
describe("NFTCollateralLoan", function () {
    // Fixture to deploy the contract with predefined state
    async function deployNFTCollateralLoanFixture() {
        // Deploy DAI ERC20 token
        const dai = await hre.viem.deployContract("DaiMock", [1000000]);

        // Deploy NFTCollateralLoan contract with DAI address
        const nftCollateralLoan = await hre.viem.deployContract("NFTCollateralLoan", [dai.address]);
        const nftCollection = await hre.viem.deployContract("CryptoPunksMock", ["CryptoPunks", "PUNK"]);
        const nftCollectionNotWhiteListed = await hre.viem.deployContract("AzukiMock", ["Azuki", "AZK"]);
        await nftCollateralLoan.write.whitelistNFTCollection([nftCollection.address, true]);


        return {
            nftCollateralLoan,
            dai,
            nftCollection,
            nftCollectionNotWhiteListed,
        };
    }

    // Describe block for deployment tests
    describe("Deployment", function () {
        it("Should set the owner correctly", async function () {
            const { nftCollateralLoan } = await loadFixture(deployNFTCollateralLoanFixture);
            const owner = await nftCollateralLoan.read.owner();
            // Assert owner is set correctly
            const [ownerTest, otherAccount] = await hre.viem.getWalletClients();
            expect(owner).to.equal(getAddress(ownerTest.account.address));
        });

        // Add more deployment tests as needed
    });

    // Describe block for contract functionalities
    describe("Functionality", function () {
        // Test case for locking NFT and getting tokens
        it("Should block locking an NFT from a non-whitelisted collection and getting tokens", async function () {
            const { nftCollateralLoan, dai, nftCollection, nftCollectionNotWhiteListed } = await loadFixture(deployNFTCollateralLoanFixture);
            await dai.write.approve([nftCollateralLoan.address, 1000000]); // Approve DAI tokens
            await dai.write.transfer([nftCollateralLoan.address, 1000000]); // Transfer DAI tokens to contract
            const [ownerTest, otherAccount] = await hre.viem.getWalletClients();
            await nftCollectionNotWhiteListed.write.mint([ownerTest.account.address, BigInt(1)]); // Convert number to BigInt
            await nftCollectionNotWhiteListed.write.approve([nftCollateralLoan.address, BigInt(1)]); // Convert number to BigInt
            // Lock NFT and get tokens
            const loanDuration = 7 * 24 * 60 * 60; // 7 days in seconds
            // Check that the next line reverts with 'Collection not whitelisted'
            await expect(nftCollateralLoan.write.lockNFTAndGetTokens([nftCollection.address, BigInt(1), BigInt(loanDuration)])).to.be.rejected;
        });
        // Test case for locking NFT and getting tokens
        it("Should allow locking an NFT from a whitelisted collection and getting tokens", async function () {
            const { nftCollateralLoan, dai, nftCollection, nftCollectionNotWhiteListed } = await loadFixture(deployNFTCollateralLoanFixture);
            await dai.write.approve([nftCollateralLoan.address, 1000000]); // Approve DAI tokens
            await dai.write.transfer([nftCollateralLoan.address, 1000000]); // Transfer DAI tokens to contract
            const [ownerTest, otherAccount] = await hre.viem.getWalletClients();
            await nftCollection.write.mint([ownerTest.account.address, BigInt(1)]); // Convert number to BigInt
            await nftCollection.write.approve([nftCollateralLoan.address, BigInt(1)]); // Convert number to BigInt
            // Lock NFT and get tokens
            const loanDuration = 7 * 24 * 60 * 60; // 7 days in seconds
            await expect(nftCollateralLoan.write.lockNFTAndGetTokens([nftCollection.address, BigInt(1), BigInt(loanDuration)])).to.be.fulfilled;
        });

        // Test case for redeeming NFT
        it("Should allow redeeming NFT", async function () {
            // Write test case for redeeming NFT
            const { nftCollateralLoan, dai, nftCollection, nftCollectionNotWhiteListed } = await loadFixture(deployNFTCollateralLoanFixture);
            const nftPrice = await nftCollateralLoan.read.nftPrice()
            await dai.write.approve([nftCollateralLoan.address, 1000000]); // Approve DAI tokens
            await dai.write.transfer([nftCollateralLoan.address, 1000000]); // Transfer DAI tokens to contract
            const [ownerTest, otherAccount] = await hre.viem.getWalletClients();
            await nftCollection.write.mint([otherAccount.account.address, BigInt(1)]); // Convert number to BigInt
            await nftCollection.write.approve([nftCollateralLoan.address, BigInt(1)], { account: otherAccount.account.address }); // Convert number to BigInt
            const daiBalanceBefore = await dai.read.balanceOf([otherAccount.account.address]);
            await expect(nftCollateralLoan.write.lockNFTAndGetTokens([nftCollection.address, BigInt(1), BigInt(7 * 24 * 60 * 60)], { account: otherAccount.account.address })).to.be.fulfilled; // Lock NFT
            // Get DAI balance of otherAccount after the transaction
            const daiBalanceAfter = await dai.read.balanceOf([otherAccount.account.address]);

            // Assert that the DAI balance of otherAccount is equal to nftPrice
            expect(daiBalanceAfter - daiBalanceBefore).to.equal(nftPrice);
            await dai.write.approve([nftCollateralLoan.address, nftPrice], { account: otherAccount.account.address }); // Approve DAI tokens
            await expect(nftCollateralLoan.write.redeemNFT([nftCollection.address, BigInt(1)], { account: otherAccount.account.address })).to.be.fulfilled; // Redeem NFT
            expect(daiBalanceBefore).to.equal(await dai.read.balanceOf([otherAccount.account.address]));
        });

        // Test case for liquidating NFT
        // it("Should allow liquidating NFT", async function () {
        //     // Write test case for liquidating NFT
        //     const { nftCollateralLoan, dai, nftCollection, nftCollectionNotWhiteListed } = await loadFixture(deployNFTCollateralLoanFixture);
        //     await dai.write.approve([nftCollateralLoan.address, 1000000]); // Approve DAI tokens
        //     await dai.write.transfer([nftCollateralLoan.address, 1000000]); // Transfer DAI tokens to contract
        //     const [ownerTest, otherAccount] = await hre.viem.getWalletClients();
        //     await nftCollection.write.mint([ownerTest.account.address, BigInt(1)]); // Convert number to BigInt
        //     await nftCollection.write.approve([nftCollateralLoan.address, BigInt(1)]); // Convert number to BigInt
        //     await nftCollateralLoan.write.lockNFTAndGetTokens([nftCollection.address, BigInt(1), BigInt(7 * 24 * 60 * 60)]); // Lock NFT
        //     await expect(nftCollateralLoan.write.liquidateNFT([nftCollection.address, BigInt(1)])).to.be.fulfilled; // Liquidate NFT
        // });

        // Test case for setting NFT price
        it("Should allow setting NFT price", async function () {
            // Write test case for setting NFT price
            const { nftCollateralLoan, dai, nftCollection, nftCollectionNotWhiteListed } = await loadFixture(deployNFTCollateralLoanFixture);
            const nftPriceTest = BigInt(200);
            await nftCollateralLoan.write.setNFTPrice([nftPriceTest]); // Set NFT price
            const nftPrice = await nftCollateralLoan.read.nftPrice(); // Read NFT price
            expect(nftPrice).to.equal(nftPriceTest); // Assert NFT price is set correctly
        });

        // Test case for checking if NFT is locked
        it("Should check if NFT is locked", async function () {
            // Write test case for checking if NFT is locked
            const { nftCollateralLoan, dai, nftCollection, nftCollectionNotWhiteListed } = await loadFixture(deployNFTCollateralLoanFixture);
            await dai.write.approve([nftCollateralLoan.address, 1000000]); // Approve DAI tokens
            await dai.write.transfer([nftCollateralLoan.address, 1000000]); // Transfer DAI tokens to contract
            const [ownerTest, otherAccount] = await hre.viem.getWalletClients();
            await nftCollection.write.mint([ownerTest.account.address, BigInt(1)]); // Convert number to BigInt
            await nftCollection.write.approve([nftCollateralLoan.address, BigInt(1)]); // Convert number to BigInt
            await nftCollateralLoan.write.lockNFTAndGetTokens([nftCollection.address, BigInt(1), BigInt(7 * 24 * 60 * 60)]); // Lock NFT
            const isLocked = await nftCollateralLoan.read.isNFTLocked([nftCollection.address, BigInt(1)]); // Check if NFT is locked
            expect(isLocked).to.be.true; // Assert NFT is locked
        });
        // Add more test cases for other functionalities as needed
    });
});
