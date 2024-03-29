// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockaverseMock is ERC721 {
    address public constant realContractAddress =
        0x59325733eb952a92e069C87F0A6168b29E80627f; // Mainnet address for testing purposes on testnet deployment

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    // Function to mint a token
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
