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
  const [btcTransactions, setBtcTransactions] = useState<TypeTransaction[]>([]);
  const [othersTransactions, setOthersTransactions] = useState<
    TypeTransaction[]
  >([]);
  const [usdTransactions, setUsdTransactions] = useState<TypeTransaction[]>([]);

  // Filters
  const [symbolSelected, setSymbolSelected] = useState<string>("btc");
  const [typeSelected, setTypeSelected] = useState<string[]>([
    "unknown_to_exchange",
    "exchange_to_unknown",
  ]);
  const [periodSelected, setPeriodSelected] = useState<string>("");

  useState(() => {
    getTransactions("btc", (data: TypeTransaction[]) =>
      setBtcTransactions(data)
    );
    getTransactions("eth", (data: TypeTransaction[]) =>
      setEthTransactions(data)
    );
    getTransactions("others", (data: TypeTransaction[]) =>
      setOthersTransactions(data)
    );
    getTransactions("usd", (data: TypeTransaction[]) =>
      setUsdTransactions(data)
    );
  });
  const filter = () => {
    if (!symbolSelected) return;
    const symbolData = {
      btc: btcTransactions,
      eth: ethTransactions,
      others: othersTransactions,
      usd: usdTransactions,
    };
    return symbolData[symbolSelected].filter((transaction) =>
      // type transaction
      typeSelected.length ? typeSelected.includes(transaction.type) : true
    );
  };

  return (
    <>
      <Head>
        <title>Watch The Whale - Whale Crypto Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-DFVQZY68WF`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DFVQZY68WF', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <Header />
      <main className="h-screen">
        <Container>
          <Row className="mt-10">
            <Column size="w-full md:w-1/6">
              <Filters
                symbolSelected={symbolSelected}
                setSymbolSelected={(value: string) => setSymbolSelected(value)}
                typeSelected={typeSelected}
                setTypeSelected={(value: string[]) => setTypeSelected(value)}
                periodSelected={periodSelected}
                setPeriodSelected={(value: string) => setPeriodSelected(value)}
              />
            </Column>
            <Column size="w-full md:w-5/6">
              <Bubble id="eth" data={filter()} />
              <img
                src="https://alternative.me/crypto/fear-and-greed-index.png"
                alt="Latest Crypto Fear & Greed Index"
              />
            </Column>
          </Row>
        </Container>
      </main>
      <Footer />
    </>
  );
}
