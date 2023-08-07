/** @format */

import classes from "./textarea.module.css";

import dynamic from "next/dynamic";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertFromHTML } from "draft-convert";

// import { Editor } from "react-draft-wysiwyg";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

import "node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
  editorState: EditorState;
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
  editorState,
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
      <Editor
        editorClassName={`${classes.textarea}  ${hasError && classes.invalid}`}
        editorState={editorState}
        onBlur={onBlurHandler}
        onEditorStateChange={onChangeHandler}
      />
      {/* <textarea
        className={`${classes.textarea}  ${hasError && classes.invalid}`}
        id={id}
        rows={rows}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      ></textarea> */}
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default TextArea;
