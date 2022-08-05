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


const walletPublicKey = "";

export const DropView: FC = ({ }) => {
    const { setVisible } = useWalletModal();
    const { connection } = useConnection();
    const { wallet, connect, connecting, publicKey } = useWallet();
    const [walletToParsePublicKey, setWalletToParsePublicKey] = useState<string>(walletPublicKey);
    const [NFTtoDrop, setNFTtoDrop] = useState({});
    const [refresh, setRefresh] = useState(false)
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState([]);
    const [gameList, setGameList] = useState(GameList);
    const [walletLists, setWalletLists] = useState([]);
    const [dropAmount, setDropAmount] = useState(0);


    const { nfts, isLoading, error } = useWalletNfts({
        publicAddress: walletToParsePublicKey,
        connection,
    });

    let errorMessage
    if (error) {
        errorMessage = error.message
    }


    const onUseWalletClick = () => {
        if (publicKey) {
            setWalletToParsePublicKey(publicKey?.toBase58());
        }
    };

    useEffect(() => {
        if (!publicKey && wallet) {
            try {
                connect();
            } catch (error) {
                console.log("Error connecting to the wallet: ", (error as any).message);
            }
        }
    }, [wallet, NFTtoDrop, page]);

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

    console.log(dropAmount);

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
                ): ("")}

            </div>

            <div className="flex flex-row px-[120px] justify-between mt-4">
                {page === 0 ? (
                    <button className="px-[24px] h-[60px] text-green border border-green flex items-center justify-center rounded-md hover:text-green/60 hover:border-green/60" onClick={handleWalletClick} disabled={connecting}>
                        Show NFTs
                    </button>
                ) : page === 1 ? (
                    <div className="h-[60px] px-[24px] text-white/50 border border-dashed border-white/50 flex items-center justify-center rounded-md" disabled={connecting}>
                        Select the filters
                    </div>
                ) : page === 2 ? (
                    <div className="h-[60px] px-[24px] text-white/50 border border-dashed border-white/50 flex items-center justify-center rounded-md" disabled={connecting}>
                        {"0 / 3,999" + " users"}
                    </div>
                ) : ("")}

                <div className="flex flex-row text-white/30 space-x-[8px]">
                    {page === 0 ? (
                        <div className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white/30 rounded-md ">
                            Back
                        </div>
                    ) : page === 1 ? (<button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setPage(page - 1), setNFTtoDrop("") }}>
                        Back
                    </button>) : (
                        <button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setPage(page - 1) }}>
                            Back
                        </button>
                    )}

                    {NFTtoDrop === "" ? (
                        <div className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white/30 rounded-md">
                            Next
                        </div>
                    ) : (
                        <button className="flex w-[69px] h-[40px] items-center justify-center text-[16px] border border-white text-white rounded-md hover:border-white/60 hover:text-white/60" onClick={() => { setPage(page + 1) }}>
                            Next
                        </button>
                    )}

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
                            <NftList nfts={nfts} error={error} setRefresh={setRefresh} setNFTtoDrop={setNFTtoDrop}  setDropAmount={setDropAmount}/>
                        }
                    </div>
                ) : page === 1 ? (
                    <div className="bg-gray">
                    <FilterList filter={filter} setFilter={setFilter} gameLists={gameList} />
                    </div>
                ) :
                    page === 2 ? (
                        <WalletList walletLists={WalletLists} setWalletLists={setWalletLists} />
                    ) : ("")
            }


        </div>


    )
};

type NFTListProps = {
    nfts: NftTokenAccount[];
    error?: Error;
    setRefresh: Dispatch<SetStateAction<boolean>>,
    setNFTtoDrop: Dispatch<SetStateAction<object>>,
    setDropAmount: Dispatch<number>,
};

const NftList = ({ nfts, error, setRefresh, setNFTtoDrop, setDropAmount }: NFTListProps) => {
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
                    <NftCard key={nft.mint} details={nft} onSelect={() => { }} setNFTtoDrop={setNFTtoDrop} setDropAmount={setDropAmount}  />
                ))}
            </div>
        </div>
    )
}

type FilterListProps = {
    filter: string[];
    setFilter: Dispatch<[]>;
    gameLists: any;
}

const FilterList = ({ filter, setFilter, gameLists }: FilterListProps) => {
    return (
        <div className="container pl-[120px] pt-[32px] bg-gray bg-screen">
            <div className="flex flex-row items-center">
                <p className="text-white text-[32px] font-bold">Filter users</p>
                <img className="w-[28px] h-[28px] ml-[12px]" src="/img/filter.png" />
            </div>

            <div className="flex flex-col mt-[20px]">
                <div className="flex flex-row">
                    <p className="text-[20px] text-white font-semibold mb-[12px]">New user inflow</p>
                    <img className="w-[5px] h-[5px]" src="/img/greendot.png" />
                </div>
                <div className="space-y-[8px]">
                    <div className="form-check items-center flex">
                        <input type="checkbox" className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" value="7dayNftBuyer" id="7dayNftBuyer" />
                        <label className="form-check-label inline-block text-white text-[16px] ml-[12px]" for={"7dayNftBuyer"}>
                            Users who first purchased solana NFT within the last 7 days
                        </label>
                    </div>
                    <div className="form-check items-center flex">
                        <input type="checkbox" className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" value="7dayNftBuyer2" id="7dayNftBuyer2" />
                        <label className="form-check-label inline-block text-white text-[16px] ml-[12px]" for={"7dayNftBuyer2"}>
                            Users who first purchased solana NFT within the last 7 days
                        </label>
                    </div>
                </div>

            </div>

            <hr className="w-[100%] border-white/10 mt-[20px]" />

            <div className="flex flex-col mt-[20px]">

                <p className="text-[20px] text-white font-semibold mb-[12px]">Other game user inflow</p>

                <div className="space-y-[8px]">
                    {gameLists.map(game => (
                        <div className="form-check items-center flex">
                            <input type="checkbox" className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" value={game.title} id={game.title} />
                            <label className="form-check-label inline-block text-white text-[16px] ml-[12px]" for={game.title}>
                                {game.title + " [" + game.category + "]"}
                            </label>
                        </div>
                    ))
                    }


                </div>

            </div>
        </div>

    )
}

type WalletListsProps = {
    walletLists: any,
    setWalletLists: Dispatch<[]>,

}

const WalletList = ({ walletLists, setWalletLists, }: WalletListsProps) => {
    // 0 = none, 1 = Top balance user,  2 = Top activate user
    const [sort, setSort] = useState(0);
    const [visible, setVisible] = useState(false);
    const [select, setSelect] = useState("");
    const selectList = ["All", "10", "100", "1000", "Others"];

    const handleChange = (e: any) => {
        setSelect(e.target.value);
    }


    return (
        <div className="flex flex-row justify-between px-[120px] pt-[32px] bg-gray bg-screen">

            <div className="flex-col">
                <div className="flex flex-row items-center mb-[20px]">
                    <p className="text-[24px] text-white font-bold">Select users</p>
                    <img src="/img/user-group.png" className="w-[28px] h-[28px] ml-[8px]" />
                    <div className="w-[168px] flex flex-row h-[40px] p-[12px] border border-white/10 rounded-md items-center ml-[80px]" onClick={() => setVisible(!visible)}>
                        <p className="text-[14px] text-white font-medium">{sort == 0 ? "Select how to sort" : sort == 1 ? "Top balance user" : "Top activate user"}</p>
                        <img src="/img/sort.png" className="w-[16px] h-[16px] ml-[4px]" />
                    </div>
                    {visible ? (
                        <div className="mt-[130px] ml-[255px] border border-white/20 rounded-md bg-gray flex flex-col absolute padding py-[4px] " onClick={() => { setVisible(false) }}>
                            <div className="w-[166px] py-[8px] pl-[18px] text-white text-[14px] cursor-pointer hover:bg-white/10" onClick={(() => setSort(1))}>
                                Top balance user
                            </div>
                            <div className="w-[166px] py-[8px] pl-[18px] text-white text-[14px] cursor-pointer hover:bg-white/10" onClick={(() => setSort(2))}>
                                Top activate user
                            </div>
                        </div>) : ""}

                </div>

                <div className="flex flex-row items-center mb-[12px]">
                    <input type="checkbox" className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" value="allUsers" id="allUsers" />
                    <label className="w-[250px] form-check-label inline-block text-white text-[20px] ml-[20px] font-bold" for={"allUsers"}>
                        Wallet Address
                    </label>
                    <label className="w-[250px] form-check-label inline-block text-white text-[20px] ml-[20px] font-bold" for={"allUsers"}>
                        SOL Balance
                    </label>
                </div>

                <div className="flex flex-col space-y-[8px]">
                    {walletLists.map((wallet, i) => (

                        <div key={i} className="flex flex-row items-center">
                            <input type="checkbox" className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" value={i} id={i} />
                            <label className="w-[250px] mt-0 inline-block text-white text-[16px] ml-[20px] font-bold" for={i}>
                                {wallet.address.slice(0, 4) + "..." + wallet.address.slice(wallet.address.length - 4, wallet.address.length)}
                            </label>
                            <label className="w-[250px]  inline-block text-white text-[16px] ml-[20px] font-bold" for={i}>
                                {wallet.balance}
                            </label>
                        </div>

                    ))}
                </div>




            </div>

            <div className="flex w-[488px] h-[260px] bg-white/10 border rounded-md border-[#F9F9F91A] flex-col py-[20px] px-[24px]">
                <div className="mb-[12px]">
                    <p className="text-white text-[20px] font-bold" >How many people you want to send?</p>
                    <p className="text-white/50 text-[16px]">it will be selected from the top</p>
                </div>
                <div className="space-y-[8px]">
                    {
                        selectList.map((value, i) => (
                            <div key={i} className="flex items-center">
                                <input type="radio" id={value} value={value} name="amount"
                                    checked={select == value}
                                    onChange={handleChange}
                                    className="form-radio  text-white/0 appearance-none ring-1 bg-white/0 ring-white/50 checked:ring-green" />
                                <label for={value} className="text-white text-[16px] ml-[12px]">{value}</label>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )

}
