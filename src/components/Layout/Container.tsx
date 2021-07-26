import React, { FC } from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
  isFull?: boolean;
};

const defaultProps: Props = {
  children: null,
  className: "",
  isFull: false,
};

const Container: FC<Props> = ({ children, className, isFull }: Props) => {
  return (
    <div
      className={`${
        isFull ? "container-full" : "container mx-auto"
      }  px-4 ${className}`}
    >
      {children}
    </div>
  );
};

Container.defaultProps = defaultProps;
export default Container;
