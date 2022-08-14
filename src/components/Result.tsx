
import Link from "next/link";
import { GameList } from "views/DropView/GameList";

type Wallet = {
    account_address: string;
    balances: string;
    transaction_count: string;
}
type ResultProps = {
    walletLists: any,
    NFTtoDrop: any,
    holdNum: number,
    dropAmount: number,
    mintAddress: string,
    checkedItems: Set<unknown>,
    gameFilter: Set<unknown>
}

export const Result = ({ walletLists, NFTtoDrop, holdNum, dropAmount, mintAddress, checkedItems, gameFilter }: ResultProps) => {


    return (
        <div className="flex flex-col pl-[120px] pt-[32px] bg-gray pb-[50px]">
            <div className="flex flex-col w-[895px] px-[24px] py-[20px] bg-green/10 border border-green rounded-md">
                <p className="text-green text-[16px] font-bold mb-[12px] ">Overview</p>

                <div>
                    <div className="flex flex-row">
                        <div className="flex flex-col space-y-[10px]">
                            <p className="w-[220px] text-[20px] text-white/50">NFT name</p>
                            <p className="w-[220px] text-[20px] text-white/50">Existing Amount</p>
                            <p className="w-[220px] text-[20px] text-white/50">Sending Amount</p>
                            <p className="w-[220px] text-[20px] text-white/50">Remaining Amount</p>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col space-y-[10px]">
                                <p className="w-[220px] text-[20px] text-yellow font-bold">{NFTtoDrop.name}</p>
                                <p className="w-[220px] text-[20px] text-white">{holdNum}</p>
                                <p className="w-[220px] text-[20px] text-yellow font-bold">{dropAmount}</p>
                                <p className="w-[220px] text-[20px] text-white">{holdNum - dropAmount}</p>
                            </div>
                        </div>


                    </div>
                </div>

            </div>

            <div className="mt-[40px] ">
                <p className="text-[32px] text-white font-bold">NFT</p>
                <div className="flex flex-row border border-white rounded-lg  w-[895px] mt-[20px] bg-white/10">
                    <img className="w-[285px] h-[285px]" src={NFTtoDrop.image} />


                    <div className="flex flex-col bg-white/10 p-[28px] w-[610px]">
                        <p className="text-[24px] text-white font-bold">{NFTtoDrop.name}</p>
                        <p className="mt-[8px] text-[16px] text-white font-light">{NFTtoDrop.description}</p>

                        <hr className="border border-white/10 my-[20px]" />

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row justify-between">
                                <p className='text-[12px] text-white'>Amount</p>
                                <p className='text-[14px] text-yellow ml-[8px] font-semibold'>{dropAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                            </div>
                            <Link href={"https://solscan.io/token/" + mintAddress}>
                                <a target="_blank">
                                    <img src="/img/solscanLink.png" />
                                </a>
                            </Link>
                        </div>
                    </div>

                </div>
                <hr className="border border-white/10 my-[40px] w-[895px]" />

            </div>
            <div className="flex flex-col">
                <div className="flex flex-row items-center mb-[20px]">
                    <p className="text-white text-[32px] font-bold">Select Filter(s)</p>
                    <div className="bg-white/10 ml-[16px] text-[16px] text-white font-light px-[16px] py-[8px]">{checkedItems.size + " Filters"}</div>
                </div>
                <div className="flex flex-col">
                    {
                        checkedItems.has("first_nft") || checkedItems.has("nft_transaction") ?
                            (<p className="text-[20px] text-white mb-[12px]">New user inflow</p>) : ("")
                    }
                    {
                        checkedItems.has("first_nft") ? (<div className="flex flex-row mb-[8px]">
                            <img className="w-[20px] h-[20px] mr-[8px]" src="/img/check.png" />
                            <p className="text-white text-[16px]">Users who first purchased solana NFT within the last 7 days</p>
                        </div>) : ("")
                    }
                    {
                        checkedItems.has("nft_transaction") ? (<div className="flex flex-row mb-[8px]">
                            <img className="w-[20px] h-[20px] mr-[8px]" src="/img/check.png" />
                            <p className="text-white text-[16px]">Users who make Transaction on solana within the last 7 days</p>
                        </div>) : ("")
                    }


                    {
                        checkedItems.has("game_nft_holder") ? (<p className="text-[20px] mb-[12px] text-white">Other game user inflow</p>) : ("")
                    }
                    {
                        
                        GameList.map(game => gameFilter.has(game.code) ? (
                            <div key={game.code} className="flex flex-row mb-[8px]">
                        <img className="w-[20px] h-[20px] mr-[8px]" src="/img/check.png" />
                        <p className="text-white text-[16px]">{game.title + " [ " + game.category+ " ]"}</p>
                    </div>
                        ): (""))
                    }
                    
                   

                </div>
                <hr className="border border-white/10 my-[40px] w-[895px]" />


            </div>

            <div className="flex flex-col">
                <div className="flex flex-row items-center mb-[20px]">
                    <p className="text-white text-[32px] font-bold">Select user(s)</p>
                    <div className="bg-white/10 ml-[16px] text-[16px] text-white font-light px-[16px] py-[8px]">{dropAmount + " users"}</div>
                </div>
                <div className="flex flex-row items-center mb-[12px]">
                    <img className="w-[20px] h-[20px] mr-[8px]" src="/img/check.png" />
                    <p className="text-[20px] text-white font-bold w-[250px] mr-[8px]">Wallet Address</p>
                    <p className="text-[20px] text-white font-bold">SOL Balance</p>
                </div>
                {walletLists.slice(0, dropAmount).map((wallet:Wallet) =>
                (
                    <div key={wallet.account_address} className="flex flex-col space-y-[8px]">
                        <div className="flex flex-row items-center">
                            <img className="w-[20px] h-[20px] mr-[8px]" src="/img/check.png" />
                            <p className="text-[16px] text-white font-bold w-[250px] mr-[8px]"> {wallet.account_address.slice(0, 4) + "..." + wallet.account_address.slice(wallet.account_address.length - 4, wallet.account_address.length)}</p>
                            <p className="text-[16px] text-white font-bold">{wallet.balances.toString().slice(0, 6)}</p>
                        </div>
                    </div>
                ))}


            </div>
        </div>
    )
}