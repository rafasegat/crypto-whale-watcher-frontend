import React, { FC, useState } from 'react';

type Props = {
  label?: string;
};

const defaultProps: Props = {
  label: ''
}

const Button: FC<Props> = ({ label }: Props) => {
  return (
    <>
      <button type="button">
        {label}
      </button>
    </>
  );
};

Button.defaultProps = defaultProps;
export default Button;