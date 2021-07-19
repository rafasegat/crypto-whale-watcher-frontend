import Head from "next/head";
import React, { useEffect, useState } from "react";
import Header from "../src/components/Header/Header";
import Footer from "../src/components/Footer/Footer";
import Column from "../src/components/Layout/Column";
import Container from "../src/components/Layout/Container";
import Row from "../src/components/Layout/Row";
import Filters from "components/Filters/Filters";
import Bubble from "components/DataViz/Bubble/Bubble";
import { getTransactions } from "rest/endpoints";

declare global {
  type TypeTransaction = {
    blockchain: string;
    symbol: string;
    id: string;
    transaction_type: string;
    hash: string;
    type: string; // walletToExchange | exchangeToWallet | walletToWallet
    from: any;
    to: any;
    timestamp: number;
    amount: number;
    amount_usd: number;
    transaction_count: number;
  };
}

export default function Home() {
  const [ethTransactions, setEthTransactions] = useState<TypeTransaction[]>([]);
  // const [btcTransactions, setBtcTransactions] = useState<TypeTransaction[]>([]);
  // const [maticTransactions, setBtcTransactions] = useState<TypeTransaction[]>(
  //   []
  // );
  // const [xrpTransactions, setBtcTransactions] = useState<TypeTransaction[]>([]);
  // const [btcTransactions, setBtcTransactions] = useState<TypeTransaction[]>([]);
  // const [btcTransactions, setBtcTransactions] = useState<TypeTransaction[]>([]);

  // Filters
  const [typeTransactionsSelected, setTypeTransactionsSelected] = useState("");

  useState(() => {
    // Ethereum
    console.log("Fetching ETH transactions....");
    getTransactions("eth", (data: TypeTransaction[]) => {
      const formattedData = data.map((transaction) => {
        transaction.type = `${transaction.from.owner_type}_to_${transaction.to.owner_type}`;
        return transaction;
      });
      console.log(formattedData);
      setEthTransactions(formattedData);
    });
    // Bitcoin
    //   getTransactions("btc", (data: TypeTransaction[]) => {
    //     const formattedData = data.map((transaction) => {
    //       transaction.type = `${transaction.from.owner_type}_to_${transaction.to.owner_type}`;
    //       return transaction;
    //     });
    //     setBtcTransactions(formattedData);
    //   });
  }, []);

  useEffect(() => {
    setEthTransactions(
      ethTransactions.filter(
        (transaction) => transaction.type === typeTransactionsSelected
      )
    );
  }, [typeTransactionsSelected]);

  return (
    <>
      <Head>
        <title>Watch The Whale - Whale Crypto Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <main className="h-screen">
        <Container>
          <Row className="eth-section" alignItemsCenter>
            <Column>
              {/* <Filters typeTransactionsSelected={typeTransactionsSelected} /> */}
              <Bubble id="eth" data={ethTransactions} />
            </Column>
          </Row>
        </Container>
        {typeTransactionsSelected}
      </main>
      <Footer />
    </>
  );
}
