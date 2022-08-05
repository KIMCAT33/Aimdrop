import Link from "next/link";
import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { ConnectWallet } from "../../components/ConnectWallet";
import styles from "./index.module.css";


const walletPublicKey = "";

export const HomeView: FC = ({ }) => {
    const { publicKey } = useWallet();
    const [walletToParsePublicKey, setWalletToParsePublicKey] = useState<string>(walletPublicKey);

    const onUseWalletClick = () => {
        if (publicKey) {
            setWalletToParsePublicKey(publicKey?.toBase58());
        }
    };

    return (
        <div className="bg-my_bg_image w-[100%] h-[100%] bg-local bg-cover">
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
                                    <p className=" hover:text-white/60">Drop Game Items</p>
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

            <div className="flex flex-col mx-auto container items-center mt-[230px]">
                <p className="text-[110px] text-white font-bold">Ready, Aim, Drop!</p>
                <p className="text-[32px] text-white font-light mt-[20px]">Best way to advertise your game to users!</p>
                <div className="flex flex-row justify-between space-x-[32px] mt-[48px] font-bold ">
                    <Link href="/drop">
                        <a>
                            <div className="px-[30px] py-[20px] mx-auto  rounded-md hover:bg-green border border-white hover:border-0 hover:text-gray text-white text-[24px] ">
                                Drop Game Items
                            </div>
                        </a>
                    </Link>
                    <Link href="/upload">
                        <a>
                            <div className="px-[30px] py-[20px] mx-auto  rounded-md hover:bg-green border border-white hover:border-0 hover:text-gray text-white text-[24px]">
                                Make Game Items
                            </div>
                        </a>
                    </Link>

                </div>
            </div>
        </div>


    )
}