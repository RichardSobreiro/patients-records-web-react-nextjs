/** @format */

import classes from "./input.module.css";

import { CSSProperties } from "react";

export enum InputType {
  TEXT,
  EMAIL,
  DATE,
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
  }
  return (
    <>
      {readOnly ? (
        <label htmlFor={id} className={`${classes.label}`} style={labelStyle}>
          <span className={classes.readOnly_label}>{label}:</span>{" "}
          {type === InputType.DATE
            ? new Date(value.replace(/-/g, "/")).toLocaleDateString()
            : value}
        </label>
      ) : (
        <>
          <label htmlFor={id} className={`${classes.label}`} style={labelStyle}>
            {label}
          </label>
          <input
            className={`${
              isPaymentSection ? classes.input_payment : classes.input
            } ${hasError && classes.invalid}`}
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
