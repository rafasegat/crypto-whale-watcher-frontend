/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC, useEffect, useState } from "react";

const SELECT_ALL_VALUE = "***";

type CheckboxObject = { [x: string]: any };
const defaultCheckboxObject = { value: "", label: "" };
type CheckboxValue = string | number | CheckboxObject;

type Props = {
  name: string;
  label?: string | ((value: CheckboxValue[]) => React.ReactNode);
  value?: CheckboxValue[];
  options: CheckboxValue[];
  getOptionValue?: (option: CheckboxValue) => string | number;
  getOptionLabel?: (option: CheckboxValue) => React.ReactNode;
  onChange?: (value: CheckboxValue[]) => void;
  required?: boolean;
  allowSelectAll?: boolean;
  displayDirection?: "vertical" | "horizontal";
};
const defaultGetOptionLabel = (option) => {
  if (typeof option === "object") {
    return option.label;
  }
  return option;
};
const defaultGetOptionValue = (option) => {
  if (typeof option === "object") {
    return option.value;
  }
  return option;
};

const defaultProps: Partial<Props> = {
  label: "",
  value: [],
  getOptionValue: defaultGetOptionValue,
  getOptionLabel: defaultGetOptionLabel,
  onChange: () => {},
  required: false,
  allowSelectAll: false,
  displayDirection: "vertical",
};

const CheckboxGroup: FC<Props> = ({
  name,
  label = "",
  value = [],
  options,
  getOptionValue = defaultGetOptionValue,
  getOptionLabel = defaultGetOptionLabel,
  onChange = () => {},
  required = false,
  allowSelectAll = false,
  displayDirection = "vertical",
}: Props) => {
  const id = `checkbox_${name}`;
  const [localValue, setLocalValue] = useState<CheckboxValue[]>(value);

  const getLabel = () => {
    if (typeof label === "function") {
      return label(localValue);
    }
    return label;
  };
  const localGetOptionValue = (option: CheckboxValue) => {
    if (typeof option === "object" && option.value === SELECT_ALL_VALUE) {
      return option.value;
    }
    return getOptionValue(option);
  };
  const localGetOptionLabel = (option: CheckboxValue) => {
    if (typeof option === "object" && option.value === SELECT_ALL_VALUE) {
      const allSelected = localValue.length === options.length;
      return allSelected ? "Deselect all" : "Select all";
    }
    return getOptionLabel(option);
  };
  const getIsChecked = (option: CheckboxValue) => {
    if (typeof option === "object" && option.value === SELECT_ALL_VALUE) {
      return localValue.length === options.length;
    }
    return !!getCheckboxValues(localValue, false).find(
      (checkedOption) =>
        localGetOptionValue(checkedOption) === localGetOptionValue(option)
    );
  };

  const handleRequired = (setRequired: boolean): void => {
    const checkboxes = document.getElementsByName(id);
    for (let i = 0; i < checkboxes.length; i++) {
      (checkboxes[i] as HTMLInputElement).required = setRequired;
      (checkboxes[i] as HTMLInputElement).setCustomValidity(
        setRequired ? "Please select at least one value" : ""
      );
    }
  };
  const onChangeCheckbox = (newValue: string, isChecked: boolean): void => {
    let changeValue;
    if (newValue === SELECT_ALL_VALUE) {
      changeValue = isChecked ? [] : [...options];
    } else {
      const optionValue =
        options.find((opt) => localGetOptionValue(opt) === newValue) ||
        defaultCheckboxObject;
      changeValue = isChecked
        ? localValue.filter(
            (item) =>
              localGetOptionValue(item) !== localGetOptionValue(optionValue)
          )
        : options.filter((o1) =>
            [...localValue, optionValue].find(
              (o2) => getOptionValue(o1) === getOptionValue(o2)
            )
          );
    }
    onChange(changeValue);
    setLocalValue(changeValue);
    handleRequired(!changeValue.length);
  };

  useEffect(() => {
    handleRequired(required && !localValue.length);
  }, []);

  useEffect(() => {
    setLocalValue(value);
    handleRequired(required && !value.length);
  }, [value]);

  return (
    <div className="datandis-checkbox-group">
      {label && <label>{getLabel()}</label>}
      <ul className={`checkbox-group-list direction-${displayDirection}`}>
        {getCheckboxValues(options, allowSelectAll).map((option, index) => {
          const checkboxId = `checkbox_item_${name}_${index}`;
          const isChecked = getIsChecked(option);
          const isSelectAll = localGetOptionValue(option) === SELECT_ALL_VALUE;

          return isSelectAll ? (
            <div className="checkbox-group-select-all">
              <button
                key={`checkbox-group-${id}-select-all`}
                aria-label="Select / Deselect all"
                onClick={() =>
                  onChangeCheckbox(
                    localGetOptionValue(option).toString(),
                    isChecked
                  )
                }
              >
                {localGetOptionLabel(option)}
              </button>
            </div>
          ) : (
            <li
              key={`checkbox-group-${id}-${localGetOptionValue(option)}`}
              className={`${isChecked ? "is-checked" : "not-checked"}`}
            >
              <input
                type="checkbox"
                id={checkboxId}
                name={id}
                value={localGetOptionValue(option)}
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
                      localGetOptionValue(option).toString(),
                      isChecked
                    );
                }}
              />
              {/* <span className="fake-input">
                <BaseIcon icon="check" viewBox="15" size="15" />
              </span> */}
              <label htmlFor={checkboxId}>
                <span>{localGetOptionLabel(option)}</span>
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

function getCheckboxValues(
  options: CheckboxValue[],
  addSelectAllBox = false
): CheckboxValue[] {
  if (addSelectAllBox) {
    return [...options, { value: SELECT_ALL_VALUE }];
  }
  return options;
}
