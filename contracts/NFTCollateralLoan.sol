// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the ERC20 interface and ERC20 token implementation
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Import the ERC721 interface and ERC721 token implementation
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "hardhat/console.sol";

contract NFTCollateralLoan {
    address public owner;
    IERC20 public erc20Token;
    mapping(address => bool) public whitelistedNFTCollections;
    uint256 public nftPrice = 100; // Example fixed price for all NFTs

    struct Loan {
        address borrower;
        uint256 dueDate;
        uint256 amountDue;
        bool isLiquidated;
    }

    // Mapping from collection address and token ID to its corresponding loan
    mapping(address => mapping(uint256 => Loan)) public nftLoans;

    constructor(address _erc20Token) {
        owner = msg.sender;
        erc20Token = IERC20(_erc20Token);
    }

    modifier onlyOwner() virtual {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function whitelistNFTCollection(
        address collectionAddress,
        bool status
    ) external onlyOwner {
        whitelistedNFTCollections[collectionAddress] = status;
    }

    function lockNFTAndGetTokens(
        address nftCollection,
        uint256 tokenId,
        uint256 loanDuration
    ) external {
        require(
            whitelistedNFTCollections[nftCollection],
            "Collection not whitelisted"
        );
        IERC721 nftContract = IERC721(nftCollection);

        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Not the NFT owner"
        );
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        // Setup the loan
        nftLoans[nftCollection][tokenId] = Loan({
            borrower: msg.sender,
            dueDate: block.timestamp + loanDuration,
            amountDue: nftPrice,
            isLiquidated: false
        });

        require(
            erc20Token.transfer(msg.sender, nftPrice),
            "ERC20 transfer failed"
        );
    }

    function redeemNFT(address nftCollection, uint256 tokenId) external {
        Loan storage loan = nftLoans[nftCollection][tokenId];
        console.log("Loan borrower: %s", loan.borrower);
        require(!loan.isLiquidated, "NFT is liquidated");
        console.log("Loan due date: %s", loan.dueDate);
        require(loan.borrower == msg.sender, "Not the borrower");
        console.log(" Current timestamp: %s", block.timestamp);
        require(block.timestamp <= loan.dueDate, "Loan overdue");
        console.log("Amount due: %s", loan.amountDue);
        require(
            erc20Token.transferFrom(msg.sender, address(this), loan.amountDue),
            "Failed to repay"
        );
        console.log("Transfer successful");

        // Transfer NFT back to borrower
        IERC721(nftCollection).transferFrom(address(this), msg.sender, tokenId);

        // Mark the loan as paid
        delete nftLoans[nftCollection][tokenId];
    }

    function liquidateNFT(
        address nftCollection,
        uint256 tokenId
    ) external onlyOwner {
        Loan storage loan = nftLoans[nftCollection][tokenId];

        require(block.timestamp > loan.dueDate, "Loan not overdue");
        require(!loan.isLiquidated, "Already liquidated");

        loan.isLiquidated = true;

        // Implement liquidation logic as required
    }

    function setNFTPrice(uint256 newPrice) external onlyOwner {
        nftPrice = newPrice;
    }

    function isNFTLocked(
        address nftCollection,
        uint256 tokenId
    ) external view returns (bool) {
        Loan memory loan = nftLoans[nftCollection][tokenId];
        return (loan.borrower != address(0));
    }
}
