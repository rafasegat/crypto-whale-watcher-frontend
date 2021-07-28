import React, { FC } from "react";
import Radio from "components/Form/Radio/Radio";
import Checkbox from "components/Form/Checkbox/Checkbox";

type Props = {
  data: TypeTransaction[];
  symbolSelected: string;
  setSymbolSelected: (value: string) => void;
  othersSymbolSelected: string[];
  setOthersSymbolSelected: (value: string[]) => void;
  typeSelected: string[];
  setTypeSelected: (value: string[]) => void;
  periodSelected: string;
  setPeriodSelected: (value: string) => void;
};

const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const Filters: FC<Props> = ({
  data,
  symbolSelected,
  setSymbolSelected,
  othersSymbolSelected,
  setOthersSymbolSelected,
  typeSelected,
  setTypeSelected,
  periodSelected,
  setPeriodSelected,
}: Props) => {
  let othersSymbolOptions = [];
  if (symbolSelected === "others") {
    const dataGrouped = groupBy(data, "symbol");
    for (const property in dataGrouped) {
      othersSymbolOptions.push({
        label: `${property.toUpperCase()} (${dataGrouped[property].length})`,
        value: property.toUpperCase(),
        count: dataGrouped[property].length,
      });
    }
    othersSymbolOptions.sort((a, b) => {
      if (a.count > b.count) return -1;
      if (a.count < b.count) return 1;
    });
  }
  return (
    <div>
      {/* <h3 className="font-bold mb-5">Filters</h3> */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <Radio
          id="symbol"
          label="Currency"
          value={symbolSelected}
          displayDirection="vertical"
          options={[
            { label: "Bitcoin", value: "btc" },
            { label: "Ethereum", value: "eth" },
            { label: "Others (MATIC, XRP, UNI, etc)", value: "others" },
            { label: "USD", value: "usd" },
          ]}
          onChange={(item: any) => setSymbolSelected(item.value)}
        />
      </div>

      {symbolSelected === "others" ? (
        <div className="mb-2 pb-2 border-b border-gray-100">
          <Checkbox
            id="other-currencies"
            label={`Other Currencies${
              othersSymbolSelected.length ? "" : " (showing all)"
            }`}
            value={othersSymbolSelected}
            options={othersSymbolOptions}
            onChange={(items: string[]) => {
              setOthersSymbolSelected(items);
            }}
          />
        </div>
      ) : null}

      <div className="mb-2 pb-2 border-b border-gray-100">
        <Checkbox
          id="transaction"
          label="Transaction"
          value={typeSelected}
          options={[
            {
              label: "Wallet → Exchange",
              description:
                "It usually means the person wants to sell it. Dump is coming. :(",
              value: "unknown_to_exchange",
            },
            {
              label: "Exchange → Wallet",
              description:
                "It usually means the person bought and wants to hold it.",
              value: "exchange_to_unknown",
            },
            {
              label: "Wallet → Wallet",
              description: "",
              value: "unknown_to_unknown",
            },
            {
              label: "Exchange → Exchange",
              description: "",
              value: "exchange_to_exchange",
            },
            {
              label: "Wallet → Other",
              description: "",
              value: "unknown_to_other",
            },
            {
              label: "Other → Wallet",
              description: "",
              value: "other_to_unknown",
            },
          ]}
          onChange={(items: string[]) => {
            setTypeSelected(items);
          }}
        />
      </div>

      <div className="mb-2 pb-2 border-b border-gray-200">
        <Radio
          id="period"
          label="Period"
          value={periodSelected}
          displayDirection="vertical"
          options={[
            { label: "1 Hour", value: "one_hour" },
            { label: "4 Hours", value: "four_hours" },
            { label: "1 Day", value: "one_day" },
            { label: "1 Week", value: "one_week" },
            { label: "1 Month", value: "one_month" },
          ]}
          onChange={(item: any) => setPeriodSelected(item.value)}
        />
      </div>
    </div>
  );
};

export default Filters;
