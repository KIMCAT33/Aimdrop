
import { Dispatch, FC, useState, useEffect, SetStateAction } from "react";
import axios from 'axios';


type Wallet = {
    account_address: string;
    balances: string;
    transaction_count: string;
}

type WalletListsProps = {
    walletLists: any,
    setDropAmount: Dispatch<number>,
    dropAmount: number,
    walletToSend: any,
    setWalletToSend: any,
    setSorting: Dispatch<string>,
    sorting: string,
    apiUrl: string,


}

export const WalletList = ({ walletLists, setDropAmount, dropAmount, walletToSend, setWalletToSend, setSorting, sorting, apiUrl }: WalletListsProps) => {

    const [visible, setVisible] = useState(false);
    const [select, setSelect] = useState("");
    const selectList = ["All", "1", "10", "100", "Others"];
    console.log(sorting);



    const handleChange = (e: any) => {
        setSelect(e.target.value);
    }


    {
        (select != "All" && select != "Others" && select != "") ? (
            setDropAmount(Number(select))
        ) : (select == "All" ? (setDropAmount(walletLists.length)) : select == "Others" ? ("") : (""))
    }


    
    return (
        <div className="flex flex-row justify-between px-[120px] pt-[32px] bg-gray bg-screen pb-[50px]">

            <div className="flex-col">
                <div className="flex flex-row items-center mb-[20px]">
                    <p className="text-[24px] text-white font-bold">Select users</p>
                    <img src="/img/user-group.png" className="w-[28px] h-[28px] ml-[8px]" />
                    <div className="w-[168px] flex flex-row h-[40px] p-[12px] border border-white/10 rounded-md items-center ml-[80px]" onClick={() => setVisible(!visible)}>
                        <p className="text-[14px] text-white font-medium">{sorting == "" ? "Select how to sort" : sorting == "balances" ? "Top balance user" : "Top activate user"}</p>
                        <img src="/img/sort.png" className="w-[16px] h-[16px] ml-[4px]" />
                    </div>
                    {visible ? (
                        <div className="mt-[160px] ml-[255px] border border-white/20 rounded-md bg-gray flex flex-col absolute padding py-[4px] " onClick={() => { setVisible(false) }}>

                            <div className="w-[166px] py-[8px] pl-[18px] text-white text-[14px] cursor-pointer hover:bg-white/10" onClick={(async () => { setSorting("balances") })}>
                                Top balance user
                            </div>
                            <div className="w-[166px] py-[8px] pl-[18px] text-white text-[14px] cursor-pointer hover:bg-white/10" onClick={(async () => { setSorting("transaction_count") })}>
                                Top activate user
                            </div>
                            <div className="w-[166px] py-[8px] pl-[18px] text-white text-[14px] cursor-pointer hover:bg-white/10" onClick={(async () => { setSorting("") })}>
                                Reset
                            </div>
                        </div>) : ""}

                </div>

                <div className="flex flex-row items-center mb-[12px]">
                    <input 
                        type="checkbox" 
                        className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" 
                        value="allUsers" 
                        id="allUsers"
                        checked={dropAmount === walletLists.length}
                     />
                    <label className="w-[250px] form-check-label inline-block text-white text-[20px] ml-[20px] font-bold" htmlFor={"allUsers"}>
                        Wallet Address
                    </label>
                    <label className="w-[250px] form-check-label inline-block text-white text-[20px] ml-[20px] font-bold" htmlFor={"allUsers"}>
                        SOL Balance
                    </label>
                </div>

                <div className="flex flex-col space-y-[8px]">
                    {walletLists.slice(0, 100).map((wallet:Wallet, i: string) => (

                        <div key={i} className="flex flex-row items-center">
                            <input type="checkbox" className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" value={i} id={i}
                                checked={Number(i) < dropAmount}

                            />
                            <label className="w-[250px] mt-0 inline-block text-white text-[16px] ml-[20px] font-bold" htmlFor={i}>
                                {wallet.account_address.slice(0, 4) + "..." + wallet.account_address.slice(wallet.account_address.length - 4, wallet.account_address.length)}
                            </label>
                            <label className="w-[250px]  inline-block text-white text-[16px] ml-[20px] font-bold" htmlFor={i}>
                                {wallet.balances}
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
                            <div key={i} className="flex items-center flex-row">
                                <input type="radio" id={value} value={value} name="amount"
                                    checked={select == value}
                                    onChange={handleChange}
                                    className="form-radio  text-white/0 appearance-none ring-1 bg-white/0 ring-white/50 checked:ring-green" />
                                <label htmlFor={value} className="text-white text-[16px] ml-[12px]">{value}</label>
                                {value === "Others" ?
                                    (select === "Others" ? (
                                        <input
                                            className="ml-[10px] bg-white/10 w-[200px] pl-[10px] text-white rounded-sm"
                                            type="number"
                                            placeholder="e.g. 356"
                                            onChange={(e) => setDropAmount(Number(e.target.value))}
                                        />
                                    ) : (""))
                                    : ("")}
                            </div>
                        ))
                    }

                </div>

            </div>

        </div>
    )

}



