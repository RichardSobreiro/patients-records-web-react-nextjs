/** @format */

import classes from "./textarea.module.css";

export enum TextAreaTheme {
  STANDARD = 1,
  SECONDARY = 2,
  PHOTO_VIEWER = 3,
  LIGHT_BLUE = 4,
}

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
  theme?: TextAreaTheme;
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
  theme,
}: Props) => {
  let labelCssClass = classes.label;

  if (theme) {
    switch (theme) {
      case TextAreaTheme.STANDARD:
        break;
      case TextAreaTheme.SECONDARY:
        labelCssClass = classes.secondary_label;
        break;
    }
  }

  return (
    <>
      <label htmlFor={id} className={labelCssClass}>
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
