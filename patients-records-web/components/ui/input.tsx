/** @format */

import classes from "./input.module.css";

import { CSSProperties } from "react";

export enum InputType {
  TEXT,
  EMAIL,
  DATE,
  DATE_TIME,
}

export enum InputTheme {
  STANDARD = 1,
  SECONDARY = 2,
}

type Props = {
  type: InputType;
  label: string;
  id: string;
  hasError: boolean;
  errorMessage: string;
  placeholder?: string;
  labelStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  value?: any;
  onChangeHandler?: any;
  onBlurHandler?: any;
  required?: boolean;
  isPaymentSection?: boolean;
  readOnly?: boolean;
  inputTheme?: InputTheme;
};

const Input = ({
  type,
  label,
  id,
  hasError,
  errorMessage,
  placeholder,
  labelStyle,
  inputStyle,
  value,
  onChangeHandler,
  onBlurHandler,
  required,
  isPaymentSection,
  readOnly,
  inputTheme,
}: Props) => {
  let typeString = "text";
  switch (type) {
    case InputType.TEXT:
      typeString = "text";
      break;
    case InputType.EMAIL:
      typeString = "email";
      break;
    case InputType.DATE:
      typeString = "date";
      break;
    case InputType.DATE_TIME:
      typeString = "datetime-local";
      break;
  }

  let labelCssClass = `${classes.label}`;
  let inputCssClass = `${
    isPaymentSection ? classes.input_payment : classes.input
  }`;
  if (inputTheme) {
    switch (inputTheme) {
      case InputTheme.STANDARD:
        labelCssClass = `${classes.label}`;
        inputCssClass = `${
          isPaymentSection ? classes.input_payment : classes.input
        }`;
        break;
      case InputTheme.SECONDARY:
        labelCssClass = `${classes.label_secondary}`;
        inputCssClass = `${classes.input_secondary}`;
        break;
    }
  }

  return (
    <>
      {readOnly ? (
        <label htmlFor={id} className={labelCssClass} style={labelStyle}>
          <span className={classes.readOnly_label}>{label}:</span>{" "}
          {type === InputType.DATE
            ? new Date(value.replace(/-/g, "/")).toLocaleDateString()
            : value}
        </label>
      ) : (
        <>
          <label htmlFor={id} className={labelCssClass} style={labelStyle}>
            {label}
          </label>
          <input
            className={`${inputCssClass} ${hasError && classes.invalid}`}
            style={inputStyle}
            type={typeString}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
          />
        </>
      )}
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default Input;
