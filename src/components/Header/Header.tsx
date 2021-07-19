import React, { FC } from "react";
import Container from "../Layout/Container";
import Row from "../Layout/Row";
import Column from "../Layout/Column";
import Logo from "../Logo/Logo";
import Menu from "../Menu/Menu";

const Header: FC = () => {
  return (
    <header>
      <Container>
        <Row alignItemsCenter>
          <Column size="w-1/3 ">
            <Logo />
          </Column>
          <Column size="w-2/3">
            <div className="flex justify-end">
              <Menu />
            </div>
          </Column>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
