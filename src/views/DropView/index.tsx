import Link from "next/link";
import { Dispatch, FC, useState, useEffect, SetStateAction } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ConnectWallet } from "../../components/ConnectWallet";
import { useWalletNfts, NftTokenAccount } from "@nfteyez/sol-rayz-react";
import styles from "./index.module.css";
import { Loader } from "components/Loader";
import { NftCard } from "./NftCard";
import { GameList } from "./GameList";
import { WalletLists } from "./WalletList";
import { Metaplex } from "@metaplex-foundation/js";
import axios from 'axios';
import { drop } from "lodash";
import { NftList } from "components/NftList";
import { FilterList } from "components/FilterList";
import { Result } from "components/Result";
import { WalletList } from "components/WalletList";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, LAMPORTS_PER_SOL, SystemProgram, SendTransactionError } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
import { NodeWallet } from '@metaplex/js';

import {
    Fanout,
    FanoutClient,
    FanoutMembershipMintVoucher,
    FanoutMembershipVoucher,
    FanoutMint,
    MembershipModel
} from "@glasseaters/hydra-sdk";
import { Account } from "near-api-js";
import { FinalModal } from "components/FinalModal";


type Wallet = {
    account_address: string;
    balances: string;
    transaction_count: string;
}

type NFT = {
    name: string;
    symbol: string;
    image: string;
    external_url: string;
    description: string;
    attributes: Array<{trait_type:string, value: string}>;
    address: string;
}


const walletPublicKey = "";

export const DropView: FC = ({ }) => {
    const { setVisible } = useWalletModal();
    const { connection } = useConnection();
    const { wallet, connect, connecting, publicKey } = useWallet();
    const Wallet = useWallet();
    const [walletToParsePublicKey, setWalletToParsePublicKey] = useState<string>(walletPublicKey);
    const [NFTtoDrop, setNFTtoDrop] = useState<NFT>({
        name: "",
        symbol: "",
        image: "",
        external_url: "",
        description: "",
        attributes: [],
        address: ""
    });
    const [refresh, setRefresh] = useState(false)
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState([]);
    const [gameList, setGameList] = useState(GameList);
    const [walletLists, setWalletLists] = useState<Wallet[]>([]);
    const [holdNum, setHoldNum] = useState(0);
    const [dropAmount, setDropAmount] = useState(0);
    const [walletToSend, setWalletToSend] = useState([]);
    const [mintAddress, setMintAddress] = useState("");
    const [finalModal, setFinalModal] = useState(false);
    const [isSending, setisSending] = useState(false);
    const [signature, setSignature] = useState('');
    const [systemError, setSystemError] = useState('');

    // api filter
    const [apiUrl, setApiUrl] = useState('http://15.165.204.98:5000/filter_selection?');
    // filter_1=first_nft&  ilter_2=nft_transaction&
    const [checkedItems, setCheckedItems] = useState(new Set());


    // filter_3=game_nft_holder&project_name=''& 
    const [gameFilter, setGameFilter] = useState(new Set());
  

    // sorting=balances
    // "" = none, balances = Top balance user,  transaction_count = Top activate user
    const [sorting, setSorting] = useState("");
    
 
    

    
    const applyFilter = async () => {
        await setApiUrl(`http://15.165.204.98:5000/filter_selection?` + `${checkedItems.has("first_nft") ? "filter_1=first_nft&" : ""}` + `${checkedItems.has("nft_transaction") ? "filter_2=nft_transaction&" : ""}` + `${sorting !="" ? "sorting=" + sorting : ""}`);
    }




    const { nfts, isLoading, error } = useWalletNfts({
        publicAddress: walletToParsePublicKey,
        connection,
    });

    let errorMessage
    if (error) {
        errorMessage = (error as any).message
    }


    const onUseWalletClick = () => {
        if (publicKey) {
            setWalletToParsePublicKey(publicKey?.toBase58());
        }
    };

    console.log(checkedItems);

    useEffect(() => {
        if (!publicKey && wallet) {
            try {
                connect();
            } catch (error) {
                console.log("Error connecting to the wallet: ", (error as any).message);
            }
        }
        
        setApiUrl(`http://15.165.204.98:5000/filter_selection?` + `${checkedItems.has("first_nft") ? "filter_1=first_nft&" : ""}` + `${checkedItems.has("nft_transaction") ? "filter_2=nft_transaction&" : ""}` + `${sorting !="" ? "sorting=" + sorting : ""}`);
        axios.get(apiUrl!).then(response => { setWalletLists(response.data); });
    


    }, [apiUrl,sorting, checkedItems]);

    const handleWalletClick = () => {
        try {
            if (!wallet) {
                setVisible(true);
            } else {
                connect();
            }
            onUseWalletClick();
        } catch (error) {
            console.log("Error connecting to the wallet: ", (error as any).message);
        }
    };

    const checkBalance = async () => {
        return (holdNum - dropAmount > 0);
    }
    /*
        (async () => {
            let fanoutSdk: FanoutClient;
          
            const authorityWallet = Keypair.generate();
          
            fanoutSdk = new FanoutClient(
              connection,
              new NodeWallet(authorityWallet)
            );
          
            const init = await fanoutSdk.initializeFanout({
              totalShares: 100,
              name: `Test${Date.now()}`,
              membershipModel: MembershipModel.Wallet,
            });
          })();
    
    */
    const SendOnClick = async () => {

        setSignature('');
        setisSending(true);
        try {
            let Tx = new Transaction();
            const Receivers: string[] = [];
            for (let i = 0; i < dropAmount; i++) {
                Receivers.push(walletLists[i].account_address);
            }


            const mint = new PublicKey(NFTtoDrop!.address);
            const ownerTokenAccount = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                mint,
                publicKey!,
            );


            for (let i = 0; i < dropAmount; i++) {

                const source_account = await Token.getAssociatedTokenAddress(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    mint,
                    publicKey!,
                );

                let destPubkey: PublicKey;
                destPubkey = new PublicKey(Receivers[i]);

                const destination_account = await Token.getAssociatedTokenAddress(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    mint,
                    destPubkey
                );

                const createIx = Token.createAssociatedTokenAccountInstruction(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    mint,
                    destination_account,
                    destPubkey,
                    publicKey!
                )

                let transferIx: TransactionInstruction;

                transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey!,
                    [],
                    1 * 10 ** 0
                )

                Tx.add(createIx, transferIx);


            }

            const sendSignature = await Wallet.sendTransaction(Tx, connection);

            const confirmed = await connection.confirmTransaction(sendSignature, 'processed');
            if (confirmed) {
                const signature = sendSignature.toString();
                console.log("signature is : ", signature);
                setisSending(false);
                setSignature(signature);
    
            } else {
                console.log("Confirmation failed")
            }


        } catch (error) {
            const err = (error as any)?.message;
            setisSending(false);
        }


    }



    return (
        <div className="bg-gray min-h-screen bg-local bg-cover">

            <div className="container mx-auto 2xl:px-0  py-[10px]">
                <div >
                    <div className="navbar mb-2 justify-between flex-row flex items-center px-[32px]">
                        <div className="px-2">
                            <div className="text-sm breadcrumbs">
                                <ul className="text-xs sm:text-xl">
                                    <li>
                                        <Link href="/">
                                            <a>
                                                <img src="/img/logo.png" />
                                            </a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-row space-x-[40px] text-white items-center">
                            <Link href="/drop">
                                <a>
                                    <p className="border-b border-green font-bold hover:border-green/60  hover:text-white/60">Drop Game Items</p>
                                </a>
                            </Link>
                            <Link href="/upload">
                                <a>
                                    <p className=" hover:text-white/60">Make Game Items</p>
                                </a>
                            </Link>
                            <div className="flex-none">
                                <WalletMultiButton className="btn btn-ghost" />
                                <ConnectWallet onUseWalletClick={onUseWalletClick} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex justify-center mt-[28px]">
                {page === 0 ? (
                    <img src="/img/process-1.png" />
                ) : (page === 1 || page === 2) ? (
                    <img src="/img/process-2.png" />
                ) : page === 3 ? (
                    <img src="/img/process-3.png" />
                ) : ("")}

            </div>


            <FinalModal finalModal={finalModal} signature={signature} setPage={setPage} setFinalModal={setFinalModal} SendOnClick={SendOnClick} isSending={isSending} />
            

            <div className="flex flex-row px-[120px] justify-between mt-4">
                {page === 0 ? (
                    <button className="px-[24px] h-[60px] text-green border border-green flex items-center justify-center rounded-md hover:text-green/60 hover:border-green/60" onClick={handleWalletClick} disabled={connecting}>
                        Show NFTs
                    </button>
                ) : page === 1 ? (
                    <div className="h-[60px] px-[24px] text-white/50 border border-dashed border-white/50 flex items-center justify-center rounded-md" >
                        {`${walletLists.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " "}/  ${checkedItems.size} filters`}
                    </div>
                
                ) : page === 2 ? (
                    <div className="h-[60px] px-[24px] text-white/50 border border-dashed border-white/50 flex items-center justify-center rounded-md">
                        {`${dropAmount} / ${walletLists.length}` + " users"}
                    </div>
                ) : (<div></div>)}

                <div className="flex flex-row text-white/30 space-x-[8px]">
                    {page === 0 ? (
                        <div className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white/30 rounded-md ">
                            Back
                        </div>
                    ) : page === 1 ? (<button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setPage(page - 1), setNFTtoDrop({
                        name: "",
                        symbol: "",
                        image: "",
                        external_url: "",
                        description: "",
                        attributes: [],
                        address: ""
                    }) }}>
                        Back
                    </button>) : page === 2 ? (
                        <button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setPage(page - 1), setCheckedItems(new Set()) }}>
                            Back
                        </button>
                    ) : (<button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setPage(page - 1) }}>
                        Back
                    </button>)}

                    {Object.keys(NFTtoDrop).length === 0 ? (
                        <div className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white/30 rounded-md">
                            Next
                        </div>
                    ) : page === 3 ? (
                        (
                            <div>
                                <button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setFinalModal(true) }}>
                                    Drop
                                </button>



                            </div>
                        )
                    )
                        : (
                            <button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setPage(page + 1) }}>
                                Next
                            </button>
                        )
                    }

                </div>
            </div>
            <hr className="mt-5 border-white/10 " />
            {
                page === 0 ? (
                    <div className="mb-auto mt-[32px] flex flex-auto justify-center bg-gray min-h-screen">
                        {error && errorMessage != "Invalid address: " ? (
                            <div>
                                <h1>Error Occures</h1>
                                {(error as any)?.message}
                            </div>
                        ) : null}

                        {!error && isLoading &&
                            <div>
                                <Loader />
                            </div>

                        }
                        {!error && !isLoading && !refresh &&
                            <NftList nfts={nfts} error={error as any} setRefresh={setRefresh} setNFTtoDrop={setNFTtoDrop} setHoldNum={setHoldNum} setMintAddress={setMintAddress} />
                        }
                    </div>
                ) : page === 1 ? (
                    <div className="bg-gray">
                        <FilterList filter={filter} setFilter={setFilter} gameLists={gameList} sorting={sorting} walletLists={walletLists} checkedItems={checkedItems} setCheckedItems={setCheckedItems} setGameFilter={setGameFilter as any} gameFilter={gameFilter} applyFilter={applyFilter} setApiUrl={setApiUrl}/>
                    </div>
                ) :
                    page === 2 ? (
                        <WalletList walletLists={walletLists} setDropAmount={setDropAmount} dropAmount={dropAmount} walletToSend={walletToSend} setWalletToSend={setWalletToSend} setSorting={setSorting} sorting={sorting} apiUrl={apiUrl}/>
                    ) : (

                        <Result walletLists={walletLists} NFTtoDrop={NFTtoDrop} holdNum={holdNum} dropAmount={dropAmount} mintAddress={mintAddress} checkedItems={checkedItems} gameFilter={gameFilter}/>
                    )
            }


        </div>


    )
};







