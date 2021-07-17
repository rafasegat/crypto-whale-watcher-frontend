import React, { FC } from "react";
import Container from "../Layout/Container";
import Row from "../Layout/Row";
import Column from "../Layout/Column";

const Header: FC = () => {
  return (
    <header>
      <Container>
        <Row alignItemsCenter>
          <Column size="w-1/4">Type Transaction</Column>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
