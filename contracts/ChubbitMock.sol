// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ChubbitMock is ERC721 {
    address public constant realContractAddress =
        0x76603b2Dc8E75fD3411935169AC30f6b3387B7A2; // Mainnet address for testing purposes on testnet deployment

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    // Function to mint a token
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
