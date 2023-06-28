/** @format */

import classes from "./textarea.module.css";

type Props = {
  label: string;
  id: string;
  rows: number;
  required: boolean;
  placeholder?: string;
  value?: any;
  onChangeHandler?: any;
};

const TextArea = ({
  label,
  id,
  rows,
  required,
  placeholder,
  value,
  onChangeHandler,
}: Props) => {
  return (
    <>
      <label htmlFor={id} className={classes.label}>
        {label}
      </label>
      <textarea
        className={classes.textarea}
        id={id}
        rows={rows}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChangeHandler(event.target.value)}
      ></textarea>
    </>
  );
};

export default TextArea;
