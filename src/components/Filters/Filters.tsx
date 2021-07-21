import React, { FC } from "react";
import Radio from "components/Form/Radio/Radio";
// import Checkbox from "components/Form/Checkbox/Checkbox";

type Props = {
  symbolSelected: string;
  setSymbolSelected: (value: string) => void;
  typeTransactionsSelected: string;
  setTypeTransactionsSelected: (value: string) => void;
};

const Filters: FC<Props> = ({
  symbolSelected,
  setSymbolSelected,
  typeTransactionsSelected,
  setTypeTransactionsSelected,
}: Props) => {
  return (
    <div>
      <h3 className="font-bold mb-5">Filters</h3>
      <div>
        {/* <Checkbox
          id="symbol"
          label="Symbol"
          value={typeTransactionsSelected}
          displayDirection="vertical"
          options={[
            { label: "All", value: "all" },
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
          onChange={(item: any) => setTypeTransactionsSelected(item.value)}
        /> */}
      </div>
      <div>
        <Radio
          id="type-transaction"
          label="Type Transaction"
          value={typeTransactionsSelected}
          displayDirection="vertical"
          options={[
            { label: "All", value: "all" },
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
          onChange={(item: any) => setTypeTransactionsSelected(item.value)}
        />
      </div>
    </div>
  );
};

export default Filters;
