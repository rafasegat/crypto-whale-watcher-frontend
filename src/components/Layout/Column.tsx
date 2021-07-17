import React, { FC } from 'react';

type Props = {
  children?: React.ReactNode;
  size?: string;
  gutter?: string;
};

const defaultProps: Props = {
  children: null,
  size: 'w-full',
  gutter: ''
}

const Column: FC<Props> = ({ children, size, gutter }: Props) => {
  return (
    <div className={`${size} ${gutter}`}>
      { children}
    </div>
  );
};

Column.defaultProps = defaultProps;
export default Column;