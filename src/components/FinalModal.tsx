
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { Loader } from './Loader';

type Props = {
    finalModal: any,
    signature: any,
    setPage: any,
    setFinalModal: any,
    SendOnClick: any,
    isSending: any,
}



export const FinalModal: FC<Props> = ({
    finalModal,
    signature,
    setPage,
    setFinalModal,
    SendOnClick,
    isSending
}) => {

    useEffect(() => {

    }, [isSending])

    const mainText = `Clicking yes will aimdrop the NFT you have chosen to the listed wallets! `;
    const subText = `Yes, Aimdrop it!`;
    return (

    
        <div>
            {
                finalModal ? (!isSending ? (signature ? (<div className="w-[502px] h-[200px] p-[28px] flex flex-col absolute bg-gray border rounded-md border-white/10 justify-center ml-[40%]">
                    <p className="text-[24px] text-white font-bold ">Transaction succeed!</p>
                    <p className="text-[16px] text-white">All your Aimdrops have been successfully completed. Go to solscan and check it out</p>
                    <div className="flex flex-row">
                        <Link href="/drop">
                        <a >
                            <div className="w-[117px] px-[16px] py-[8px] border rounded-md border-white text-[16px] text-white hover:border-0 hover:text-gray hover:bg-green ml-[300px] mt-[15px] text-center font-bold" onClick={() => {setFinalModal(false); setPage(0);}}>
                                Finish
                            </div>
                        </a>
                        </Link>

                    </div>

                </div>) : (<div className="w-[502px] h-[200px] p-[28px] flex flex-col absolute bg-gray border rounded-md border-white/10 justify-center ml-[40%]">
                    <p className="text-[24px] text-white font-bold ">Are you sure?</p>
                    <p className="text-[16px] text-white">{mainText}</p>
                    <div className="flex flex-row">
                        <div className="w-[130px] px-[16px] py-[8px] flex justify-center border rounded-md border-white text-[16px] text-white hover:border-0 hover:text-gray hover:bg-green ml-[150px]" onClick={() => setFinalModal(false)}>
                            No, not yet!
                        </div>
                        <div className="w-[150px] px-[16px] py-[8px] flex justify-center border rounded-md border-white text-[16px] text-white hover:border-0 hover:text-gray hover:bg-green ml-[8px]" onClick={() => SendOnClick()}>
                            {subText}
                        </div>

                    </div>

                </div>)) : (
                    <div className="w-[502px] h-[200px] p-[28px] flex flex-col absolute bg-gray border rounded-md border-white/10 justify-center ml-[40%]">
                        <Loader />
                    </div>)) : ("")

            }
        </div>
    )
}

