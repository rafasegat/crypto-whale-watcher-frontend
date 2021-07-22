/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC, useEffect, useState } from "react";

type CheckboxObject = { [x: string]: any };
const defaultCheckboxObject = { value: "", label: "" };
type CheckboxValue = string | number | CheckboxObject;

type Props = {
  id: string;
  label?: string | ((value: CheckboxValue[]) => React.ReactNode);
  value?: CheckboxValue[];
  options: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
  displayDirection?: "vertical" | "horizontal";
};

const defaultProps: Partial<Props> = {
  label: "",
  value: [],
  onChange: () => {},
  displayDirection: "vertical",
};

const CheckboxGroup: FC<Props> = ({
  id,
  label = "",
  value = [],
  options,
  onChange = () => {},
  displayDirection = "vertical",
}: Props) => {
  const builtInID = `checkbox_${id}`;
  const [localValue, setLocalValue] = useState<CheckboxValue[]>(value);

  const getLabel = () => {
    if (typeof label === "function") {
      return label(localValue);
    }
    return label;
  };
  const getOptionLabel = (option) => {
    if (typeof option === "object") {
      return option.label;
    }
    return option;
  };
  const getOptionValue = (option) => {
    if (typeof option === "object") {
      return option.value;
    }
    return option;
  };
  const getIsChecked = (option: CheckboxValue) => {
    return !!getCheckboxValues(localValue).find(
      (checkedOption) =>
        getOptionValue(checkedOption) === getOptionValue(option)
    );
  };
  const onChangeCheckbox = (newValue: string, isChecked: boolean): void => {
    const optionValue =
      options.find((opt) => getOptionValue(opt) === newValue) ||
      defaultCheckboxObject;

    let changeValue = isChecked
      ? localValue.filter(
          (item) => getOptionValue(item) !== getOptionValue(optionValue)
        )
      : options.filter((o1) =>
          [...localValue, optionValue].find(
            (o2) => getOptionValue(o1) === getOptionValue(o2)
          )
        );

    onChange(changeValue);
    setLocalValue(changeValue);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="checkbox-group">
      {label && <label>{getLabel()}</label>}
      <ul className={`checkbox-group-list direction-${displayDirection}`}>
        {getCheckboxValues(options).map((option, index) => {
          const checkboxId = `checkbox_item_${builtInID}_${index}`;
          const isChecked = getIsChecked(option);
          return (
            <li
              key={`checkbox-group-${id}-${getOptionValue(option)}`}
              className={`${isChecked ? "is-checked" : "not-checked"}`}
            >
              <input
                type="checkbox"
                id={checkboxId}
                name={id}
                value={getOptionValue(option)}
                tabIndex={0}
                checked={isChecked}
                aria-checked={isChecked}
                className="input-native"
                onChange={(event) => {
                  onChangeCheckbox(event.target.value, isChecked);
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter")
                    onChangeCheckbox(
                      getOptionValue(option).toString(),
                      isChecked
                    );
                }}
              />
              <label htmlFor={checkboxId}>
                <span>{getOptionLabel(option)}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

CheckboxGroup.displayName = "CheckboxGroup";
CheckboxGroup.defaultProps = defaultProps;
export default CheckboxGroup;

function getCheckboxValues(options: CheckboxValue[]): CheckboxValue[] {
  return options;
}
