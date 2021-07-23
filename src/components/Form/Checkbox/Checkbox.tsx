/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC } from "react";

type typeOption = {
  label: string;
  description: string;
  value: string;
};

type Props = {
  id: string;
  label: string;
  value: string[];
  options: typeOption[];
  onChange: (value: string[]) => void;
};

const CheckboxGroup: FC<Props> = ({
  id,
  label,
  value,
  options,
  onChange,
}: Props) => {
  const builtInID = `checkbox_${id}`;

  const onChangeCheckbox = (optionSelected: string) => {
    let cloneOptionsSelected = value;
    // exists
    if (cloneOptionsSelected.indexOf(optionSelected) > -1)
      cloneOptionsSelected = cloneOptionsSelected.filter(
        (item) => item !== optionSelected
      );
    else cloneOptionsSelected.push(optionSelected);
    onChange([...cloneOptionsSelected]);
  };

  return (
    <div className="checkbox">
      {label && <label>{label}</label>}
      <ul className="checkbox-group-list">
        {options.map((option) => {
          const checkboxId = `checkbox-${builtInID}-${option.value}`;
          const isChecked = value.indexOf(option.value) > -1;
          return (
            <li
              key={`checkbox-item-${option.value}-${builtInID}`}
              className={`${isChecked ? "is-checked" : "not-checked"}`}
            >
              <input
                type="checkbox"
                id={checkboxId}
                value={option.value}
                tabIndex={0}
                checked={value.indexOf(option.value) > -1}
                aria-checked={value.indexOf(option.value) > -1}
                onChange={(event) => onChangeCheckbox(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") onChangeCheckbox(option.value);
                }}
              />
              <label htmlFor={checkboxId}>
                <span className="fake-input"></span>
                <div>
                  <span>{option.label}</span>
                  {option.description ? (
                    <span className="block text-gray-400">
                      {option.description}
                    </span>
                  ) : null}
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CheckboxGroup;
