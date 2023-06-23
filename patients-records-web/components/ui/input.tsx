/** @format */

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
};

const Input = ({ type, label, id, required, placeholder }: Props) => {
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
      <label htmlFor={id} className={classes.label}>
        {label}
      </label>
      <input
        className={classes.input}
        type={typeString}
        id={id}
        required={required}
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
