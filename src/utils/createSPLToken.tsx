import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, MintLayout } from '@solana/spl-token';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair, TransactionInstruction } from '@solana/web3.js';
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Dispatch, SetStateAction, useState } from 'react';
import { PROGRAM_ID, DataV2, createCreateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata';

import { bundlrStorage, findMetadataPda, keypairIdentity, Metaplex, UploadMetadataInput, walletAdapterIdentity, MetaplexFileTag } from "@metaplex-foundation/js";

const endpoint = 'https://solana-mainnet-rpc.allthatnode.com/ZXfksUIJXUmKMeSSMaAHtR8Igb7FzVeq';
const solanaConnection = new Connection(endpoint);



export async function createSPLToken(owner: PublicKey, wallet: WalletContextState, connection: Connection, quantity: number, decimals: number, isChecked: boolean, tokenName: string, symbol: string, externalUrl: string, uri: string,  description: string,file: Readonly<{
    buffer: Buffer;
    fileName: string;
    displayName: string;
    uniqueName: string;
    contentType: string | null;
    extension: string | null;
    tags: MetaplexFileTag[];
}>,  attribute: any, setIscreating: Dispatch<SetStateAction<boolean>>, setTokenAddresss: Dispatch<SetStateAction<string>>, setSignature: Dispatch<SetStateAction<string>>) {
    



    const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(bundlrStorage());


    
    const MY_TOKEN_METADATA: UploadMetadataInput = {
        "name": tokenName,
        "symbol": symbol,
        "description": description,
        "image": uri,
        "external_url" :externalUrl,
        "attributes": [
            {
                "trait_type": "rarity",
                "value": "unique"
            }
        ]
    }
    
    const ON_CHAIN_METADATA = {
        name: MY_TOKEN_METADATA.name,
        symbol: MY_TOKEN_METADATA.symbol,
        uri: "TBD",
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null, 
        uses: null
    } as DataV2;
    
    
    try {


        setIscreating(true)
        setTokenAddresss('')

        const mint_rent = await Token.getMinBalanceRentForExemptMint(connection);

        const mint_account = Keypair.generate();

        let InitMint: TransactionInstruction

        const [metadataPDA] = await PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                PROGRAM_ID.toBuffer(),
                mint_account.publicKey.toBuffer(),
            ], PROGRAM_ID
        );

        if (file) {
            const ImageUri = await metaplex.storage().upload(file);
            console.log(ImageUri);
            MY_TOKEN_METADATA.image = ImageUri;
        }

        const {uri} = await metaplex.nfts().uploadMetadata(MY_TOKEN_METADATA);
        console.log(`Arweave URL:`, uri);

        ON_CHAIN_METADATA.uri = uri;



        const tokenMetadata: DataV2 = {
            name: tokenName, 
            symbol: symbol,
            uri: externalUrl,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
          };

        const args = {
            data: tokenMetadata,
            isMutable: true,
        };

        const createMintAccountInstruction = await SystemProgram.createAccount({
            fromPubkey: owner,
            newAccountPubkey: mint_account.publicKey,
            space: MintLayout.span,
            lamports: mint_rent,
            programId: TOKEN_PROGRAM_ID,
        });

        if (isChecked) {
            InitMint = await Token.createInitMintInstruction(
                TOKEN_PROGRAM_ID,
                mint_account.publicKey,
                decimals,
                owner,
                owner
            );

        } else {
            InitMint = await Token.createInitMintInstruction(
                TOKEN_PROGRAM_ID,
                mint_account.publicKey,
                decimals,
                owner,
                null
            );

        };

        const associatedTokenAccount = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint_account.publicKey,
            owner
        );

        const createATAInstruction = await Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint_account.publicKey,
            associatedTokenAccount,
            owner,
            owner
        );

        const mintInstruction = await Token.createMintToInstruction(
            TOKEN_PROGRAM_ID,
            mint_account.publicKey,
            associatedTokenAccount,
            owner,
            [],
            quantity * 10 ** decimals
        );


        const MetadataInstruction =  createCreateMetadataAccountV2Instruction(
            {
                metadata: metadataPDA,
                mint: mint_account.publicKey,
                mintAuthority: owner,
                payer: owner,
                updateAuthority: owner,
            },
            {
                createMetadataAccountArgsV2:
                {
                    data: ON_CHAIN_METADATA,
                    isMutable: true,
                }
            }
        );

        const createAccountTransaction = new Transaction().add(createMintAccountInstruction, InitMint, createATAInstruction, mintInstruction, MetadataInstruction);

        const createAccountSignature = await wallet.sendTransaction(createAccountTransaction, connection, { signers: [mint_account] });

        const createAccountconfirmed = await connection.confirmTransaction(createAccountSignature, 'confirmed');

        const signature = createAccountSignature.toString()

        
        if (createAccountconfirmed) {
            setIscreating(false);
            setTokenAddresss(mint_account.publicKey.toBase58());
            setSignature(signature)
        }

    } catch (error) {
        setIscreating(false);
    }

}