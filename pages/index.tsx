import Head from "next/head";
import React, { useState } from "react";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Column from "components/Layout/Column";
import Container from "components/Layout/Container";
import Row from "components/Layout/Row";
import Filters from "components/Filters/Filters";
import Bubble from "components/DataViz/Bubble/Bubble";
import Loading from "components/Loading/Loading";
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
  const [isLoading, setIsLoading] = useState(true);
  // Sizing
  const [widthScreen, setWidthScreen] = useState(600);

  // Filters
  const [symbolSelected, setSymbolSelected] = useState<string>("btc");
  const [othersSymbolSelected, setOthersSymbolSelected] = useState<string[]>(
    []
  );
  const [typeSelected, setTypeSelected] = useState<string[]>([
    "unknown_to_exchange",
    "exchange_to_unknown",
  ]);
  const [periodSelected, setPeriodSelected] = useState<string>("one_day");

  useState(() => {
    getTransactions(
      { symbol: "btc", period: getTimestamp(periodSelected || "one_day") },
      (data: TypeTransaction[]) => {
        setIsLoading(false);
        setBtcTransactions(data);
      }
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

  const filterData = ({ removeFilter }) => {
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
          : true) &&
        // others filtering
        (symbolSelected === "others" &&
        removeFilter !== "others" &&
        othersSymbolSelected.length
          ? othersSymbolSelected.includes(transaction.symbol.toUpperCase())
          : true);
      return filteredData;
    });
  };

  const dataFiltered = filterData({
    removeFilter: "",
  });
  const dataFilteredWithoutOthers = filterData({
    removeFilter: "others",
  });

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
      <main style={{ height: isLoading ? "calc(100vh - 200px)" : "" }}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          <Container isFull>
            <Row className="flex-wrap md:flex-nowrap">
              <Column size="w-full md:w-60 md:flex-none">
                <Filters
                  data={dataFilteredWithoutOthers}
                  symbolSelected={symbolSelected}
                  setSymbolSelected={(value: string) =>
                    setSymbolSelected(value)
                  }
                  othersSymbolSelected={othersSymbolSelected}
                  setOthersSymbolSelected={(value: string[]) =>
                    setOthersSymbolSelected(value)
                  }
                  typeSelected={typeSelected}
                  setTypeSelected={(value: string[]) => setTypeSelected(value)}
                  periodSelected={periodSelected}
                  setPeriodSelected={(value: string) =>
                    setPeriodSelected(value)
                  }
                />
              </Column>
              <Column size="w-full">
                <Bubble
                  id="bubble"
                  data={dataFiltered}
                  widthScreen={widthScreen}
                  symbolSelected={symbolSelected}
                  typeSelected={typeSelected}
                />
                <img
                  src="https://alternative.me/crypto/fear-and-greed-index.png"
                  alt="Latest Crypto Fear & Greed Index"
                />
              </Column>
            </Row>
          </Container>
        )}
      </main>
      {isLoading ? null : <Footer />}
    </>
  );
}
