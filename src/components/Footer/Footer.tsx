import React, { FC } from "react";
import Container from "../Layout/Container";
import Row from "../Layout/Row";
import Column from "../Layout/Column";

const Footer: FC = () => {
  return (
    <footer className="text-right py-5 font-sm">
      <Container isFull>
        <Row alignItemsCenter className="justify-end">
          <Column>
            Developed by{" "}
            <a
              className="hover:underline"
              target="_blank"
              href="http://rafaelsegat.com/"
            >
              Raf
            </a>
          </Column>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
