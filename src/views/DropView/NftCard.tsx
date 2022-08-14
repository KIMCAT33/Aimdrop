import { FC, useState, useEffect } from 'react';
import Link from "next/link";
import useSWR from 'swr';
import { fetcher } from 'utils/fetcher';

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { first } from 'lodash';
import {Metaplex} from "@metaplex-foundation/js";
import axios from 'axios';
type Account = {
    address: string;
    amount: number;
    decimals: number;
    owner: string;
    rank: number;
}
type Props = {
    details: any;
    onSelect: (id: string) => void;
    onTokenDetailsFetched?: (props: any) => unknown;
    setNFTtoDrop: any;
    setHoldNum: any;
    setMintAddress: any;
}

export const NftCard: FC<Props> = ({
    details,
    onSelect,
    onTokenDetailsFetched = () => { },
    setNFTtoDrop,
    setHoldNum,
    setMintAddress,

}) => {
    const [fallbackImage, setFallbackImage] = useState(false);
    const { name, uri } = details?.data ?? {};
    const { data, error } = useSWR(
        uri,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );
    const [amount, setAmount] = useState(0);
 

    


    useEffect(() => {
        if (!error && !!data) {
            onTokenDetailsFetched(data);
        }
    }, [data, error]);


    const onImageError = () => setFallbackImage(true);
    const { image } = data ?? {};

    const tokenMintAddress = details.mint;
    setMintAddress(tokenMintAddress);



    const wallet = useWallet();
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    useEffect(() => {
        axios.get(`https://public-api.solscan.io/token/holders?tokenAddress=${tokenMintAddress}&offset=0&limit=10`).then( async response => {
            setAmount(response.data.data.filter((account:Account) => account.owner == wallet.publicKey?.toString())[0]?.amount)
        }
        )
    },[amount])
 

    
    const creators = details.data.creators;
    let firstCreator;
    if (creators != undefined) {
        firstCreator = details.data.creators[0].address;
    } else {
        firstCreator = tokenMintAddress;
    }

 

    return (
        <button className='card max-w-xs compact rounded-lg bg-[#212121] focus:outline-none focus:ring focus:ring-green' onClick={() => {setNFTtoDrop({...data, address:tokenMintAddress}), setHoldNum(amount)}}>
            <figure className='min-h-16 animate-pulse-color'>
                {!fallbackImage || !error ? (
                    <img
                        src={image}
                        onError={onImageError}
                        className="bg-gray object-cover h-[285px] w-[100%] rounded-sm"
                    />
                ) :
                    (
                        <div className='w-auto flex items-center justify-center bg-gray bg-opacity-40'>
                            <img
                                src="/img/logo.png"
                            />
                        </div>
                    )
                }
            </figure>
            <div className='card-body h-[132px] p-[20px] flex flex-col items-start'>
                <h2 className='text-[20px] text-white font-bold'>{name}</h2>
                <p className="mt-[8px] text-left text-white font-light text-[14px]">{data?.description.length < 30 ? data?.description.slice(0, 50) : data?.description.slice(0, 50) + "..."}</p>
                
            </div>
            <hr className='my-[12px] border-white/10 mx-[20px]'/>
            <div className='flex justify-between px-[20px] pb-[20px] items-center'>
                <div>
                {amount != undefined ? 
                <div className='flex flex-row items-center'>
                <p className='text-[12px] text-white'>Amount</p>
                <p className='text-[14px] text-yellow ml-[8px] font-semibold'>{amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                </div>
                : ("")}
                </div>
                <div>
                   
                    <Link  href={"https://solscan.io/token/" + tokenMintAddress}>
                        <a target="_blank">
                            <img src="/img/solscanLink.png" />
                        </a>
                    </Link>
                </div>
            </div>
        </button>
    )
}