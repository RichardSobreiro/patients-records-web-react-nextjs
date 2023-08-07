/** @format */

import { useState } from "react";

import { EditorState, convertToRaw } from "draft-js";

type Props = {
  validateValue: (
    input?: any | string,
    setErrorMessage?: any,
    secondValueValidationFunction?: any
  ) => boolean | string;
  secondValueValidationFunction?: any;
  initialValue?: string;
  maskFunction?: (value: string) => string;
};

const useTextArea = ({
  validateValue,
  secondValueValidationFunction,
  initialValue,
  maskFunction,
}: Props) => {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [isTouched, setIsTouched] = useState(false);
  let errorMessage = "";

  let valueIsValid = validateValue(editorState, secondValueValidationFunction);
  const hasError =
    (!valueIsValid || typeof valueIsValid === "string") && isTouched;

  if (hasError) {
    errorMessage = valueIsValid as string;
    valueIsValid = false;
  }

  const valueChangeHandler = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const inputBlurHandler = (event: any) => {
    setIsTouched(true);
  };

  const reset = () => {
    setEditorState(EditorState.createEmpty());
    setIsTouched(false);
  };

  return {
    editorState,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
    errorMessage,
    setEditorState,
  };
};

export default useTextArea;
