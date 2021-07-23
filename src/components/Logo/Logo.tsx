import React, { FC } from "react";

const Logo: FC = () => {
  return (
    <a href="/">
      <img
        className="logo"
        src="/images/logo.png"
        alt="whale watcher logo"
        style={{ width: 75 }}
      />
    </a>
  );
};

export default Logo;
