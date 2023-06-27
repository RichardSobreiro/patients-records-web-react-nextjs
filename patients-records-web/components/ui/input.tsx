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
  required: boolean;
  placeholder?: string;
  labelStyle?: CSSProperties;
  inputStyle?: CSSProperties;
};

const Input = ({
  type,
  label,
  id,
  required,
  placeholder,
  labelStyle,
  inputStyle,
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
        className={classes.input}
        style={inputStyle}
        type={typeString}
        id={id}
        required={required}
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
