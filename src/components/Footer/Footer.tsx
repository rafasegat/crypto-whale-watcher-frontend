import React, { FC } from "react";
import Container from "../Layout/Container";
import Row from "../Layout/Row";
import Column from "../Layout/Column";

const Footer: FC = () => {
  return (
    <footer className="text-right py-5 font-sm">
      <Container isFull>
        <Row alignItemsCenter className="justify-end">
          <Column>Developed by Raf</Column>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
