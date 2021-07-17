import React, { FC } from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const defaultProps: Props = {
  children: null,
  className: "",
};

const Container: FC<Props> = ({ children, className }: Props) => {
  return (
    <div className={`container mx-auto px-4 ${className}`}>{children}</div>
  );
};

Container.defaultProps = defaultProps;
export default Container;
