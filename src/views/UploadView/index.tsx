import Link from "next/link";
import React, { Dispatch, FC, useState, useEffect, SetStateAction } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ConnectWallet } from "../../components/ConnectWallet";
import { useWalletNfts, NftTokenAccount } from "@nfteyez/sol-rayz-react";
import styles from "./index.module.css";
import { Loader } from "components/Loader";
import { Metaplex, bundlrStorage, MetaplexFile, useMetaplexFileFromBrowser, walletAdapterIdentity, MetaplexFileTag, UploadMetadataInput } from "@metaplex-foundation/js-next";
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { CreateTokenButton } from "utils/CreateTokenButton";


const walletPublicKey = "";

export const UploadView: FC = ({ }) => {

    const { connection } = useConnection();
    const wallet = useWallet();
    const [walletToParsePublicKey, setWalletToParsePublicKey] =
        useState<string>(walletPublicKey);
    const { publicKey } = useWallet();

    const [quantity, setQuantity] = useState(1);
    const [decimals, setDecimals] = useState(0);
    const [tokenName, setTokenName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [externalUrl, setExternalUrl] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [description, setDescription] = useState('');
    const [attribute, setAttribute] = useState({});
    const [fileImage, setFileImage] = useState("");

    const [valueList, setValueList] = useState([]);
    const [keyList, setKeyList] = useState([]);
    const [numAttribute, setNumAttribute] = useState([0]);


    const [file, setFile] = useState<Readonly<{
        buffer: Buffer;
        fileName: string;
        displayName: string;
        uniqueName: string;
        contentType: string | null;
        extension: string | null;
        tags: MetaplexFileTag[];
    }>>()
    const [fileName, setFileName] = useState('');
    const [uri, setUri] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const metapelx = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage());

    let _file: MetaplexFile;
    const handleFileChange = async (event: any) => {
        setUri('');
        setError('');
        setUploading(false);
        setFileImage(URL.createObjectURL(event.target.files[0]));
        const browserFile = event.target?.files[0];
        _file = await useMetaplexFileFromBrowser(browserFile);
        setFile(_file);
        setFileName(_file.displayName);

    }

    console.log(description);
    const UploadFile = async () => {
        try {
            setError('');
            setUploading(true);
            if (file) {
                const uri = await metapelx.storage().upload(file);
                if (uri) {
                    setUri(uri);
                    setUploading(false);
                }
            }
        } catch (error) {
            const err = (error as any)?.message;
            setError(err);
            setUploading(false);
        }
    }


    const deleteFileImage = () => {
        URL.revokeObjectURL(fileImage);
        setFileImage("");
    }

    const onUseWalletClick = () => {
        if (publicKey) {
            setWalletToParsePublicKey(publicKey?.toBase58());
        }
    };
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
                                    <p className="  hover:text-white/60">Drop Game Items</p>
                                </a>
                            </Link>
                            <Link href="/upload">
                                <a>
                                    <p className="border-b border-green font-bold hover:border-green/60 hover:text-white/60">Make Game Items</p>
                                </a>
                            </Link>
                            <div className="flex-none">
                                <WalletMultiButton className="btn btn-ghost" />
                                <ConnectWallet onUseWalletClick={onUseWalletClick} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-white text-[32px] ml-[120px]">Make Game Items</p>
                </div>

            </div>
            <hr className="border border-white/10" />
            <div className="flex flex-row pl-[200px] pt-[28px] bg-gray pb-[150px]">
                <div>
                    <form>
                        <div className="flex flex-col space-y-[20px]">

                            <div>
                                <div className="flex flex-row mb-[4px]">
                                    <p className="text-[16px] text-[#F9FBFF]">Token Name</p>
                                    <p className="text-green items-start">*</p>
                                </div>

                                <input className="w-[692px] border-[#212121] border rounded-md p-[14px] bg-gray text-white/50 placeholder:text-[16px]"
                                    placeholder="Token name"
                                    type="text"
                                    required
                                    onChange={(e) => setTokenName(e.target.value)} />
                            </div>

                            <div>
                                <div className="flex flex-row mb-[4px]">
                                    <p className="text-[16px] text-[#F9FBFF]">Symbol</p>
                                    <p className="text-green items-start">*</p>
                                </div>

                                <input className="w-[692px] border-[#212121] border rounded-md p-[14px] bg-gray text-white/50 placeholder:text-[16px]"
                                    placeholder="Symbol"
                                    type="text"
                                    required
                                    onChange={(e) => setSymbol(e.target.value)} />
                                <p className="text-white/50 text-[12px] mt-[4px]">*Symbol is an initial for your game item like DG in 'Doggie JAM[DG]'</p>
                            </div>

                            <div>
                                <div className="flex flex-row mb-[4px]">
                                    <p className="text-[16px] text-[#F9FBFF]">Description</p>
                                    <p className="text-green items-start">*</p>
                                </div>

                                <textarea className="w-[692px] border-[#212121] border rounded-md p-[14px] bg-gray text-white/50 placeholder:text-[16px]"
                                    placeholder="Description"
                                    type="text"
                                    required
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>



                            <div>
                                <div className="flex flex-row mb-[4px]">
                                    <p className="text-[16px] text-[#F9FBFF]">External URL</p>
                                    <p className="text-green items-start">*</p>
                                </div>

                                <input className="w-[692px] border-[#212121] border rounded-md p-[14px] bg-gray text-white/50 placeholder:text-[16px]"
                                    placeholder="e.g. https://example.com"
                                    type="text"
                                    onChange={(e) => setExternalUrl(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className="flex flex-row mb-[4px]">
                                    <p className="text-[16px] text-[#F9FBFF]">Number of tokens to mint</p>
                                    <p className="text-green items-start">*</p>
                                </div>

                                <input className="w-[692px] border-[#212121] border rounded-md p-[14px] bg-gray text-white/50 placeholder:text-[16px]"
                                    placeholder="# of tokens"
                                    type="number"
                                    onChange={(e) => setQuantity(parseInt(e.target.value))} />
                            </div>


                            <div>
                                <div className="flex flex-row mb-[4px]">
                                    <p className="text-[16px] text-[#F9FBFF]">Attribute</p>
                                    <p className="text-green items-start">*</p>
                                </div>
                                <div className='space-y-[15px]'>
                                    {numAttribute.map((num, i) => (
                                        <div key={i} className="flex flex-row space-x-[4px] ">
                                            <input className="w-[316px] border-[#212121] border rounded-md p-[14px] bg-gray text-white/50 placeholder:text-[16px]"
                                                placeholder="e.g. Color"
                                                id={`attribute-key-${num}`}
                                                onChange={(e) => {
                                                    let keys = [...keyList];
                                                    keys[Number(num)] = e.target.value;
                                                    setKeyList(keys);
                                                }}
                                            />
                                            <input className="w-[316px] border-[#212121] border rounded-md p-[14px] bg-gray text-white/50 placeholder:text-[16px]"
                                                placeholder="e.g. Green"
                                                id={`attribute-value-${num}`}
                                                onChange={(e) => {
                                                    let values = [...valueList];
                                                    values[Number(num)] = e.target.value;
                                                    setValueList(values);
                                                }}
                                            />

                                            {numAttribute.length != 1 ? (<div className="w-[52px] p-[16px] items-center border-[#212121] border rounded-md cursor-pointer">
                                                <img className="w-[20px] h-[20px]" src="/img/x.png"

                                                    onClick={() => {
                                                        setNumAttribute(numAttribute.filter(number => number != num));
                                                    }}
                                                />
                                            </div>) : ("")}
                                        </div>
                                    ))}
                                </div>


                                <div className="mt-[12px] w-[137px] bg-white/10 items-center text-white text-[16px] px-[16px] py-[8px] rounded-md cursor-pointer" onClick={() => setNumAttribute((numAttribute.concat((numAttribute[numAttribute.length - 1]) + 1)))}>
                                    Add Attribute
                                </div>
                            </div>


                            <div className="form-check items-center flex">
                                <input type="checkbox" className="form-checkbox bg-gray appearance-none h-5 w-5 border border-white/50 rounded-sm checked: cursor-pointer checked:bg-gray checked:border-green text-green" value="freeze" id="freeze"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(!isChecked)}
                                />
                                <label className="form-check-label inline-block text-white text-[16px] ml-[12px]" htmlFor={"freeze"}>
                                    Enable freeze authority
                                </label>
                            </div>
                        </div>
                    </form>
                    <CreateTokenButton connection={connection} publicKey={publicKey} wallet={wallet} quantity={quantity} decimals={decimals} isChecked={isChecked} tokenName={tokenName} symbol={symbol} externalUrl={externalUrl} uri={uri} description={description} file={file} valueList={valueList} keyList={keyList} numAttribute={numAttribute}/>



                </div>


                <div className="ml-[40px]">
                    <form>
                        <input id="file" type="file" name="file" onChange={handleFileChange} style={{ display: 'none' }} />
                        <label htmlFor="file" >
                            {fileImage == "" ? (<img className="w-[265px] h-[265px] mt-[28px] cursor-pointer" src="/img/image.png" />) : (

                                <img className="w-[265px] h-[265px] mt-[28px] cursor-pointer border border-green rounded-lg" src={fileImage} />
                            )}

                        </label>

                        {fileImage == "" ? (
                            <p className="text-[16px] flex absolute text-white/50">* Upload image or asset for your game item</p>
                        ) : (
                            <div className="flex flex-row justify-between mt-[10px]">
                                <p className=" text-[16px] flex text-white/50">{fileName}</p>
                                <img src="img/x.png" className="flex w-[20px] h-[20px] cursor-pointer" onClick={deleteFileImage} />
                            </div>
                        )}


                    </form>
                </div>
            </div>


        </div>
    )
}