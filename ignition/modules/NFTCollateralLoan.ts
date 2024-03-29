import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const INIT_SUPPLY = parseEther("1000000");

const NFTCollateralLoanModule = buildModule("NFTCollateralLoanModule", (m) => {
    const chubbit = m.contract("ChubbitMock", ["Chubbit", "CHBT"]);
    const mockaverse = m.contract("MockaverseMock", ["Mockaverse", "MOCK"]);
    const degods = m.contract("DeGodsMock", ["Degods", "DEG"]);
    const initialSupply = m.getParameter("initialSupply", INIT_SUPPLY);
    const dai = m.contract("DaiMock", [initialSupply]);

    const nftCollateralLoan = m.contract("NFTCollateralLoan", [dai]);

    m.call(nftCollateralLoan, "whitelistNFTCollection", [chubbit, true], { id: "whitelistChubbit" });
    m.call(nftCollateralLoan, "whitelistNFTCollection", [mockaverse, true], { id: "whitelistMockaverse" });

    // Transfer Dai tokens to the NFTCollateralLoan contract
    const daiAmount = m.getParameter("daiAmount", parseEther("100")); // Adjust the amount as needed
    //const daiTokenContract = m.contractAt("DaiMock", daiTokenAddress);
    m.call(dai, "approve", [nftCollateralLoan, daiAmount]);
    m.call(dai, "transfer", [nftCollateralLoan, daiAmount]);
    const owner = m.getAccount(0);
    m.call(chubbit, "mint", [owner, BigInt(1)], { id: "chubbit1" })
    m.call(chubbit, "mint", [owner, BigInt(2)], { id: "chubbit2" })
    m.call(chubbit, "mint", [owner, BigInt(3)], { id: "chubbit3" })

    m.call(mockaverse, "mint", [owner, BigInt(1)], { id: "mockaverse1" });
    m.call(mockaverse, "mint", [owner, BigInt(2)], { id: "mockaverse2" });
    m.call(mockaverse, "mint", [owner, BigInt(3)], { id: "mockaverse3" });

    m.call(degods, "mint", [owner, BigInt(1)], { id: "degods1" });
    m.call(degods, "mint", [owner, BigInt(2)], { id: "degods2" });
    m.call(degods, "mint", [owner, BigInt(3)], { id: "degods3" });

    return { nftCollateralLoan, mockaverse, chubbit, degods, dai };

});

export default NFTCollateralLoanModule;
