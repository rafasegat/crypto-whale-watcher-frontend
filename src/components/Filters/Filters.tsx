import React, { FC } from "react";
import Container from "../Layout/Container";
import Row from "../Layout/Row";
import Column from "../Layout/Column";
import Radio from "components/Form/Radio/Radio";

type Props = {
  typeTransactionsSelected: string;
};

const Filters: FC<Props> = ({ typeTransactionsSelected }: Props) => {
  return (
    <div>
      <Container>
        <Row alignItemsCenter>
          <Column size="w-1/4">
            <Radio
              id="type-transaction"
              label="Type Transaction"
              value={typeTransactionsSelected}
              options={[
                { label: "Wallet -> Exchange", value: "unknown_to_exchange" },
                { label: "Exchange -> Wallet", value: "exchange_to_unknown" },
                { label: "Wallet -> Wallet", value: "unknown_to_unknown" },
              ]}
            />
          </Column>
        </Row>
      </Container>
    </div>
  );
};

export default Filters;
