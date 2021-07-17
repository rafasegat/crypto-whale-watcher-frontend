/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC, useEffect, useState } from "react";
import "./Radio.scss";

type RadioObject = { value: string | number; label: string };
const defaultRadioObject: RadioObject = { value: "", label: "" };
type RadioValue = string | number | RadioObject;

type Props = {
  id: string;
  label: string;
  value?: RadioValue;
  options: RadioValue[];
  onChange?: (value: RadioValue) => void;
  displayDirection?: "vertical" | "horizontal";
};
const defaultProps: Partial<Props> = {
  value: "",
  onChange: () => {},
  displayDirection: "horizontal",
};

const Radio: FC<Props> = (props: Props) => {
  const {
    id,
    label,
    value = "",
    options,
    onChange = () => {},
    displayDirection,
  } = props;
  const [localValue, setLocalValue] = useState<RadioValue>(value);

  const onRadioChange = (newValue: RadioObject): void => {
    const changeValue: RadioValue =
      options.find((opt) => getOptionValue(opt).value === newValue.value) ||
      defaultRadioObject;
    onChange(changeValue);
  };

  const checkedOption = getRadioCheckedOption(
    getOptions(options),
    getOptionValue(localValue)
  );

  useEffect(() => {
    if (localValue === "" && options.length) {
      const initValue = getOptions(options)[0];
      onRadioChange(initValue);
    }
  }, []);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="datandis-radio" id={id}>
      <label>{label}</label>
      <div className={`datandis-radio-options direction-${displayDirection}`}>
        {getOptions(options).map((option) => {
          const isOptionChecked = checkedOption.value === option.value;
          return (
            <div
              key={`${id}-${option.value}`}
              className="datandis-radio-option"
            >
              <input
                type="radio"
                id={`datandis-radio-opt-${option.value}`}
                value={option.value}
                checked={isOptionChecked}
                onChange={(event) => {
                  const newValue: RadioObject =
                    getOptions(options).find(
                      (opt) => opt.value.toString() === event.target.value
                    ) || defaultRadioObject;
                  onRadioChange(newValue);
                  setLocalValue(newValue);
                }}
              />
              <label htmlFor={`datandis-radio-opt-${option.value}`}>
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Radio.defaultProps = defaultProps;
Radio.displayName = "Radio";
export default Radio;

function getOptionValue(option: RadioValue): RadioObject {
  let optionLabel: string;
  let optionValue: string | number;
  if (typeof option === "object") {
    optionLabel = (option as RadioObject).label;
    optionValue = (option as RadioObject).value;
  } else {
    optionLabel = option as string;
    optionValue = option as string | number;
  }
  return { label: optionLabel, value: optionValue };
}

function getOptions(options: RadioValue[]): RadioObject[] {
  return options.map((option) => getOptionValue(option));
}

function getRadioCheckedOption(
  options: RadioObject[],
  value: RadioObject
): RadioObject {
  if (!options.length) {
    return defaultRadioObject;
  }
  const optionRadioObject = getOptionValue(value);
  let checkedOption: RadioObject = getOptionValue(options[0]);
  for (let i = 0; i < options.length; i++) {
    const listOption = getOptionValue(options[i]);
    if (listOption.value === optionRadioObject.value) {
      checkedOption = listOption;
    }
  }
  return checkedOption;
}
