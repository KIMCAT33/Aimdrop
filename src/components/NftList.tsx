import { useWalletNfts, NftTokenAccount } from "@nfteyez/sol-rayz-react";
import { Dispatch, FC, useState, useEffect, SetStateAction } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { NftCard } from "views/DropView/NftCard";

type NFTListProps = {
    nfts: NftTokenAccount[];
    error?: Error;
    setRefresh: Dispatch<SetStateAction<boolean>>,
    setNFTtoDrop: Dispatch<SetStateAction<object>>,
    setHoldNum: Dispatch<number>,
    setMintAddress: Dispatch<string>,

};

export const NftList = ({ nfts, error, setRefresh, setNFTtoDrop, setHoldNum, setMintAddress }: NFTListProps) => {
    if (error) {
        return null;
    }

    if (!nfts?.length) {
        return (
            <div className="text-center text-2xl pt-16">
                No NFTs found in this wallet
            </div>
        )
    }


    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const wallet = useWallet();
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] items-start mb-7">
                {nfts?.map((nft) => (
                    <NftCard key={nft.mint} details={nft} onSelect={() => { }} setNFTtoDrop={setNFTtoDrop} setHoldNum={setHoldNum} setMintAddress={setMintAddress} />
                ))}
            </div>
        </div>
    )
}