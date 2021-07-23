import React, { FC } from "react";
import Radio from "components/Form/Radio/Radio";
import Checkbox from "components/Form/Checkbox/Checkbox";

type Props = {
  symbolSelected: string;
  setSymbolSelected: (value: string) => void;
  typeSelected: string[];
  setTypeSelected: (value: string[]) => void;
  periodSelected: string;
  setPeriodSelected: (value: string) => void;
};

const Filters: FC<Props> = ({
  symbolSelected,
  setSymbolSelected,
  typeSelected,
  setTypeSelected,
  periodSelected,
  setPeriodSelected,
}: Props) => {
  return (
    <div>
      {/* <h3 className="font-bold mb-5">Filters</h3> */}
      <div>
        <Radio
          id="symbol"
          label="Currency"
          value={symbolSelected}
          displayDirection="vertical"
          options={[
            { label: "Bitcoin", value: "btc" },
            { label: "Ethereum", value: "eth" },
            { label: "Others", value: "others" },
            { label: "USD", value: "usd" },
          ]}
          onChange={(item: any) => setSymbolSelected(item.value)}
        />
      </div>
      <div>
        <Checkbox
          id="symbol"
          label="Symbol"
          value={typeSelected}
          options={[
            { label: "Wallet -> Exchange", value: "unknown_to_exchange" },
            { label: "Exchange -> Wallet", value: "exchange_to_unknown" },
            { label: "Wallet -> Wallet", value: "unknown_to_unknown" },
            {
              label: "Exchange -> Exchange",
              value: "exchange_to_exchange",
            },
            {
              label: "Unknown -> Other",
              value: "unknown_to_other",
            },
            {
              label: "Other -> Unknown",
              value: "other_to_unknown",
            },
          ]}
          onChange={(items: string[]) => {
            console.log(items);
            setTypeSelected(items);
          }}
        />
      </div>
      <div>
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
