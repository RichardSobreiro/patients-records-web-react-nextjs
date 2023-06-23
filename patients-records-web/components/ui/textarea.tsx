/** @format */

import classes from "./textarea.module.css";

type Props = {
  label: string;
  id: string;
  rows: number;
  required: boolean;
  placeholder?: string;
};

const TextArea = ({ label, id, rows, required, placeholder }: Props) => {
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
      ></textarea>
    </>
  );
};

export default TextArea;
