import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv"
dotenv.config();
const { PRIVATE_KEY, INFURA_API_KEY, LINEASCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    linea_goerli: {
      url: `https://linea-goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    localhost: {
      url: "http://localhost:8545", // URL of your local testnet node
    },
  },
  etherscan: {
    apiKey: {
      linea_goerli: LINEASCAN_API_KEY
    },
    customChains: [
      {
        network: "linea_goerli",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/address"
        }
      }
    ]
  }
};

export default config;
