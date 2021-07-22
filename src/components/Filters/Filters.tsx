import React, { FC } from "react";
import Radio from "components/Form/Radio/Radio";
import Checkbox from "components/Form/Checkbox/Checkbox";

type Props = {
  symbolSelected: string;
  setSymbolSelected: (value: string) => void;
  typeSelected: string[];
  setTypeSelected: (value: string[]) => void;
};

const Filters: FC<Props> = ({
  symbolSelected,
  setSymbolSelected,
  typeSelected,
  setTypeSelected,
}: Props) => {
  return (
    <div>
      <h3 className="font-bold mb-5">Filters</h3>
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
          displayDirection="vertical"
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
          onChange={(items: any) => {
            console.log(items.map((item) => item.value));
            setTypeSelected(items.map((item) => item.value));
          }}
        />
      </div>
    </div>
  );
};

export default Filters;
