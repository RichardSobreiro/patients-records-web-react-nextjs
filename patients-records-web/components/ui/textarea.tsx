/** @format */

import classes from "./textarea.module.css";

type Props = {
  label: string;
  id: string;
  hasError: boolean;
  errorMessage: string;
  rows: number;
  required: boolean;
  placeholder?: string;
  value?: any;
  onChangeHandler?: any;
  onBlurHandler?: any;
};

const TextArea = ({
  label,
  id,
  hasError,
  errorMessage,
  rows,
  required,
  placeholder,
  value,
  onChangeHandler,
  onBlurHandler,
}: Props) => {
  return (
    <>
      <label htmlFor={id} className={classes.label}>
        {label}
      </label>
      <textarea
        className={`${classes.textarea}  ${hasError && classes.invalid}`}
        id={id}
        rows={rows}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      ></textarea>
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default TextArea;
