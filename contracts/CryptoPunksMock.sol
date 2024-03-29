// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CryptoPunksMock is ERC721 {
    address public constant realContractAddress =
        0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB; // Mainnet address for testing purposes on testnet deployment

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    // Function to mint a token
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
