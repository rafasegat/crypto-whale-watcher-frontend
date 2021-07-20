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
    id: number;
    id_external: number;
    blockchain: string;
    symbol: string;
    transaction_type: string;
    hash: string;
    type: string;
    from_address: string;
    from_owner: string;
    from_owner_type: string;
    to_address: string;
    to_owner: string;
    to_owner_type: string;
    timestamp: number;
    amount: string;
    amount_usd: string;
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
    getTransactions("eth", (data: TypeTransaction[]) =>
      setEthTransactions(data)
    );
  });

  const filter = () => {
    return ethTransactions.filter((transaction) =>
      typeTransactionsSelected
        ? transaction.type === typeTransactionsSelected
        : true
    );
  };

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
              {typeTransactionsSelected}
              {/* <Filters
                typeTransactionsSelected={typeTransactionsSelected}
                setTypeTransactionsSelected={(value) =>
                  setTypeTransactionsSelected(value)
                }
              /> */}
              <Bubble
                id="eth"
                data={filter(ethTransactions)}
                typeTransactionsSelected={typeTransactionsSelected}
              />
            </Column>
          </Row>
        </Container>
        {typeTransactionsSelected}
      </main>
      <Footer />
    </>
  );
}
