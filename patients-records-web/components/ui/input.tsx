/** @format */

import { CSSProperties } from "react";
import classes from "./input.module.css";

export enum InputType {
  TEXT,
  EMAIL,
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
}: Props) => {
  let typeString = "text";
  switch (type) {
    case InputType.TEXT:
      typeString = "text";
      break;
    case InputType.EMAIL:
      typeString = "email";
      break;
  }
  return (
    <>
      <label htmlFor={id} className={`${classes.label}`} style={labelStyle}>
        {label}
      </label>
      <input
        className={`${classes.input} ${hasError && classes.invalid}`}
        style={inputStyle}
        type={typeString}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      />
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default Input;
