import { useWalletNfts, NftTokenAccount } from "@nfteyez/sol-rayz-react";
import { Dispatch, FC, useState, useEffect, SetStateAction, Children } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { NftCard } from "views/DropView/NftCard";
import axios from 'axios';

type Game = {
    title: string;
    category: string;
    code: string;
}

type FilterListProps = {
    filter: string[];
    setFilter: Dispatch<[]>;
    gameLists: any;
    sorting: string,
    walletLists: any,
    checkedItems: any,
    setCheckedItems: Dispatch<Set<string>>;
    setGameFilter:Dispatch<string>,
    applyFilter: any,
    setApiUrl: any,
    gameFilter: Set<unknown>

}

export const FilterList = ({ filter, setFilter, gameLists,sorting, walletLists, checkedItems, setCheckedItems, setGameFilter, applyFilter, setApiUrl, gameFilter }: FilterListProps) => {


    useEffect(() => {
        setApiUrl(`http://15.165.204.98:5000/filter_selection?` + `${checkedItems.has("first_nft") ? "filter_1=first_nft&" : ""}` + `${checkedItems.has("nft_transaction") ? "filter_2=nft_transaction&" : ""}` + `${sorting !="" ? "sorting=" + sorting : ""}`);
    },[gameFilter])

    const checkedItemHandler = (id: any, isChecked: any) => {

            if(isChecked){
                checkedItems.add(id);
                setCheckedItems(checkedItems);
               
    
            } else if (!isChecked && checkedItems.has(id)){
                checkedItems.delete(id);
                setCheckedItems(checkedItems);
        
            }
            applyFilter();

    }

    



    return (
        <div className="container pl-[120px] pt-[32px] bg-gray bg-screen pb-[50px]">
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
                    <Filter filterName="first_nft" checkedItemHandler={checkedItemHandler} checkedItems={checkedItems}>Users who first purchased solana NFT within the last 7 days</Filter>
                    <Filter filterName="nft_transaction" checkedItemHandler={checkedItemHandler} checkedItems={checkedItems}>Users who make Transaction on solana within the last 7 days</Filter>
                </div>

            </div>

            <hr className="w-[100%] border-white/10 mt-[20px]" />

            <div className="flex flex-col mt-[20px]">

                <p className="text-[20px] text-white font-semibold mb-[12px]">Other game user inflow</p>

                <div className="space-y-[8px]">
                    {gameLists.map((game:Game) => (
                       
                        <GameFilter key={game.code} filterName={game.code} checkedItemHandler={checkedItemHandler} setGameFilter={setGameFilter} gameFilter={gameFilter} checkedItems={checkedItems}>{game.title + " [" + game.category + "]"}</GameFilter>
                        /*<div key={game.code} className="form-check items-center flex">
                            <input 
                                type="checkbox" 
                                className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" 
                                value={game.code} 
                                id={game.code} 
                            />
                            <label className="form-check-label inline-block text-white text-[16px] ml-[12px]" htmlFor={game.code}>
                                {game.title + " [" + game.category + "]"}
                            </label>
                        </div>*/
                    ))
                    }


                </div>

            </div>
        </div>

    )
}

type Props = {
    filterName: string,
    checkedItemHandler: (id: any, isChecked: any) => any,
    checkedItems: Set<string>,

}

const Filter: FC<Props> =  ({
filterName,
children,
checkedItemHandler,
checkedItems,
}) => {
    const [checked, setChecked] = useState(false);
    const checkedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(!checked);
        checkedItemHandler(e.target.id, e.target.checked);
      

    }

    return (
        <div className="form-check items-center flex">
        <input 
            type="checkbox" 
            className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" 
            value={filterName} 
            id={filterName} 
            onChange={(e) => checkedHandler(e)}
        />
        <label className="form-check-label inline-block text-white text-[16px] ml-[12px]" htmlFor={filterName}>
            {children}
        </label>
    </div>
    )
}



type GProps = {
    filterName: string,
    checkedItemHandler: (id: any, isChecked: any) => any,
    setGameFilter: any,
    gameFilter: Set<unknown>,
    checkedItems: Set<unknown>
}

const GameFilter: FC<GProps> =  ({
filterName,
children,
checkedItemHandler,
setGameFilter,
gameFilter,
checkedItems

}) => {

    const [checked, setChecked] = useState(false);

    const checkedHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        setChecked(!checked);
        if(gameFilter.size === 0 || gameFilter.size === 1){
            checkedItemHandler("game_nft_holder", e.target.checked);
        }
       
        
        
        if(e.target.checked){
            gameFilter.add(e.target.value);
            setGameFilter(gameFilter);
        }else{
            gameFilter.delete(e.target.value);
            setGameFilter(gameFilter);
        }


        

    }

    return (
        <div className="form-check items-center flex">
        <input 
            type="checkbox" 
            className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" 
            value={filterName} 
            id={filterName} 
            onChange={(e) => checkedHandler(e)}
        />
        <label className="form-check-label inline-block text-white text-[16px] ml-[12px]" htmlFor={filterName}>
            {children}
        </label>
    </div>
    )
}

