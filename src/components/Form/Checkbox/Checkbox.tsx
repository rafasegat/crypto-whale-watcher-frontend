/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC } from 'react';
import BaseIcon from '../../Icons/BaseIcon';
import './CheckboxGroup.scss';

type Props = {
  optionsSelected: string[];
  options: string[];
  onChange: (value: string[]) => void;
};

const CheckboxGroup: FC<Props> = ({
  optionsSelected,
  options,
  onChange
}: Props) => {
  const id = `checkbox_${Math.random().toString(36).substr(2, 9)}`;

  const onChangeCheckbox = (value: string) => {
    let cloneOptionsSelected = optionsSelected;
    // exists
    if (cloneOptionsSelected.indexOf(value) > -1)
      cloneOptionsSelected = cloneOptionsSelected.filter(
        (item) => item !== value
      );
    else cloneOptionsSelected.push(value);
    onChange([...cloneOptionsSelected]);
  };

  return (
    <ul className="checkbox-group-list">
      {options.map((option) => {
        const checkboxId = `checkbox_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const isChecked = optionsSelected.indexOf(option) > -1;
        return (
          <li
            key={option}
            className={`${isChecked ? 'is-checked' : 'not-checked'}`}
          >
            <input
              type="checkbox"
              id={checkboxId}
              name={id}
              value={option}
              tabIndex={0}
              checked={optionsSelected.indexOf(option) > -1}
              aria-checked={optionsSelected.indexOf(option) > -1}
              onChange={(event) => onChangeCheckbox(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') onChangeCheckbox(option);
              }}
            />
            <label htmlFor={checkboxId}>
              <span className="fake-input">
                <BaseIcon icon="check" viewBox="15" size="15" />
              </span>
              <span>{option}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default CheckboxGroup;
