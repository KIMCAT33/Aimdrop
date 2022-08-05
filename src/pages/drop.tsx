import type { NextPage } from "next";
import Head from "next/head";
import { DropView } from "../views/DropView";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Head>
        <title>AimDrop</title>
        <meta
          name="description"
          content="Solana tools to help game teams"
          />
      </Head>
      <DropView />
    </div>
  )
}

export default Home
