import React from 'react';

// Mock data for demonstration
const availableNFTs = [
    {
        id: '1',
        image: 'https://via.placeholder.com/150',
        address: '0x123...',
        link: 'https://nft-platform.com/nfts/1',
        name: 'CryptoPunk #123',
        offer: '0.8 ETH',
        paybackPrice: '0.85 ETH',
        dueDate: '2024-04-30'
    },
    // Add more NFTs as needed
];

const lockedNFTs = [
    {
        id: '2',
        image: 'https://via.placeholder.com/150',
        address: '0x456...',
        link: 'https://nft-platform.com/nfts/2',
        name: 'ArtBlock #456',
        offer: '1.5 ETH',
        paybackPrice: '1.6 ETH',
        dueDate: '2024-05-15'
    },
    // Add more NFTs as needed
];

function NFTCard({ nft }) {
    return (
        <div className="nft-card">
            <img src={nft.image} alt={nft.name} />
            <div className="nft-details">
                <p>Address: {nft.address}</p>
                <p>
                    <a href={nft.link} target="_blank" rel="noopener noreferrer">
                        {nft.name}
                    </a>
                </p>
                <p>ID: {nft.id}</p>
                <p>Offer: {nft.offer}</p>
                <p>Payback price: {nft.paybackPrice}</p>
                <p>Due date: {nft.dueDate}</p>
            </div>
            <button>Lend</button>
        </div>
    );
};

function NFTLendingPlatform() {
    return (
        <div className="nft-lending-platform">
            <h1>Available NFTs</h1>
            <div className="available-nfts">
                {availableNFTs.map(nft => (
                    <NFTCard key={nft.id} nft={nft} />
                ))}
            </div>
            <h1>Locked NFTs</h1>
            <div className="locked-nfts">
                {lockedNFTs.map(nft => (
                    <NFTCard key={nft.id} nft={nft} />
                ))}
            </div>
        </div>
    );
};

export default NFTLendingPlatform;
