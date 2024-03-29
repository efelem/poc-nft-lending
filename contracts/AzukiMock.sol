// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AzukiMock is ERC721 {
    address public constant realContractAddress =
        0xED5AF388653567Af2F388E6224dC7C4b3241C544; // Mainnet address for testing purposes on testnet deployment

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    // Function to mint a token
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
