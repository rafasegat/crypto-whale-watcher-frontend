import Head from "next/head";
import React, { useState } from "react";
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
  type TypeFilter = {
    symbol: string;
    period: number;
  };
}

const getTimestamp = (periodSelected) => {
  const timeNow = parseInt(Date.now().toString().substr(0, 10));
  const oneHour = 3600;
  const oneDay = oneHour * 24;
  switch (periodSelected) {
    case "one_hour":
      return timeNow - oneHour;
    case "four_hours":
      return timeNow - oneHour * 4;
    case "one_day":
      return timeNow - oneDay;
    case "one_week":
      return timeNow - oneDay * 7;
    case "one_month":
      return timeNow - oneDay * 30;
  }
};

export default function Home() {
  const [ethTransactions, setEthTransactions] = useState<TypeTransaction[]>([]);
  const [btcTransactions, setBtcTransactions] = useState<TypeTransaction[]>([]);
  const [othersTransactions, setOthersTransactions] = useState<
    TypeTransaction[]
  >([]);
  const [usdTransactions, setUsdTransactions] = useState<TypeTransaction[]>([]);

  // Sizing
  const [widthScreen, setWidthScreen] = useState(600);

  // Filters
  const [symbolSelected, setSymbolSelected] = useState<string>("btc");
  const [typeSelected, setTypeSelected] = useState<string[]>([
    "unknown_to_exchange",
    "exchange_to_unknown",
  ]);
  const [periodSelected, setPeriodSelected] = useState<string>("one_day");

  useState(() => {
    getTransactions(
      { symbol: "btc", period: getTimestamp(periodSelected || "one_day") },
      (data: TypeTransaction[]) => setBtcTransactions(data)
    );
    getTransactions(
      { symbol: "eth", period: getTimestamp(periodSelected || "one_day") },
      (data: TypeTransaction[]) => setEthTransactions(data)
    );
    getTransactions(
      { symbol: "others", period: getTimestamp(periodSelected || "one_day") },
      (data: TypeTransaction[]) => setOthersTransactions(data)
    );
    getTransactions(
      { symbol: "usd", period: getTimestamp(periodSelected || "one_day") },
      (data: TypeTransaction[]) => setUsdTransactions(data)
    );
    const handleResizeEvent = () => {
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          setWidthScreen(window.innerWidth);
        }, 300);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };
    if (typeof window !== "undefined") {
      setWidthScreen(window.innerWidth);
      handleResizeEvent();
    }
  });

  const filterData = () => {
    if (!symbolSelected) return;
    const symbolData = {
      btc: btcTransactions,
      eth: ethTransactions,
      others: othersTransactions,
      usd: usdTransactions,
    };
    const timestampPeriodSelected = getTimestamp(periodSelected);
    return symbolData[symbolSelected].filter((transaction) => {
      const filteredData =
        // type transaction
        (typeSelected.length
          ? typeSelected.includes(transaction.type)
          : true) &&
        // period
        (periodSelected
          ? transaction.timestamp > timestampPeriodSelected
          : true);
      return filteredData;
    });
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
        <Container isFull>
          <Row className="mt-5 flex-wrap md:flex-nowrap">
            <Column size="w-full md:w-60 md:flex-none">
              <Filters
                symbolSelected={symbolSelected}
                setSymbolSelected={(value: string) => setSymbolSelected(value)}
                typeSelected={typeSelected}
                setTypeSelected={(value: string[]) => setTypeSelected(value)}
                periodSelected={periodSelected}
                setPeriodSelected={(value: string) => setPeriodSelected(value)}
              />
            </Column>
            <Column size="w-full">
              <Bubble id="eth" data={filterData()} widthScreen={widthScreen} />
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
