import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const INIT_SUPPLY = parseEther("1000000");

const NFTCollateralLoanModule = buildModule("NFTCollateralLoanModule", (m) => {
    const name1 = m.getParameter("name", "Azuki");
    const symbol1 = m.getParameter("symbol", "AZK");
    const azuki = m.contract("AzukiMock", [name1, symbol1]);

    const name2 = m.getParameter("name", "CryptoPunks");
    const symbol2 = m.getParameter("symbol", "PUNK");
    const cryptoPunks = m.contract("CryptoPunksMock", [name2, symbol2]);


    const initialSupply = m.getParameter("initialSupply", INIT_SUPPLY);
    const dai = m.contract("DaiMock", [initialSupply]);

    const nftCollateralLoan = m.contract("NFTCollateralLoan", [dai]);

    m.call(nftCollateralLoan, "whitelistNFTCollection", [cryptoPunks, true]);

    // Transfer Dai tokens to the NFTCollateralLoan contract
    const daiAmount = m.getParameter("daiAmount", parseEther("100")); // Adjust the amount as needed
    //const daiTokenContract = m.contractAt("DaiMock", daiTokenAddress);
    m.call(dai, "approve", [nftCollateralLoan, daiAmount]);
    m.call(dai, "transfer", [nftCollateralLoan, daiAmount]);



    return { nftCollateralLoan, azuki, cryptoPunks, dai };

});

export default NFTCollateralLoanModule;
