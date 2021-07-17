import React, { FC } from "react";

type Props = {
  children?: React.ReactNode;
  alignItemsCenter?: boolean;
  margin?: string;
  className?: string;
};

const defaultProps: Partial<Props> = {
  children: null,
  alignItemsCenter: false,
  margin: "",
};

const Row: FC<Props> = ({
  children,
  alignItemsCenter,
  margin,
  className,
}: Props) => {
  return (
    <div
      className={`flex ${
        alignItemsCenter ? "items-center" : ""
      } ${margin} ${className}`}
    >
      {children}
    </div>
  );
};

Row.defaultProps = defaultProps;
export default Row;
