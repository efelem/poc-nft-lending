import fetch from "node-fetch";
import Web3 from "web3";

const web3 = new Web3(
    new Web3.providers.HttpProvider(
        "https://linea-goerli.infura.io/v3/d8607552897d445b83e2c542b292acf7"
    )
);

const tokenURIABI = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "tokenURI",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

const tokenContract = "0x6f242e7B9f04e130124e629f57BF83aa736d9d57"; // BAYC contract address
const tokenId = 1; // A token we'd like to retrieve its metadata of

const contract = new web3.eth.Contract(tokenURIABI, tokenContract);

async function getNFTMetadata() {
    const result = await contract.methods.tokenURI(tokenId).call();

    console.log(result); // ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/101

    const ipfsURL = addIPFSProxy(result);

    const response = await fetch(ipfsURL);
    const metadata = await response.json();
    console.log(metadata); // Metadata in JSON

    const image = addIPFSProxy(metadata.image);
}

getNFTMetadata();

function addIPFSProxy(ipfsHash) {
    const URL = "https://<YOUR_SUBDOMAIN>.infura-ipfs.io/ipfs/";
    const hash = ipfsHash.replace(/^ipfs?:\/\//, "");
    const ipfsURL = URL + hash;

    console.log(ipfsURL); // https://<subdomain>.infura-ipfs.io/ipfs/<ipfsHash>
    return ipfsURL;
}