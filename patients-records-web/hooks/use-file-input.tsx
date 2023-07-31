/** @format */

import { useState } from "react";

type Props = {
  validateValue: (input?: FileCustom[] | undefined) => boolean | string;
};

export type FileCustom = {
  id?: string;
  file: File;
  url?: string;
  name?: string;
};

const useFileInput = ({ validateValue }: Props) => {
  const [selectedFile, setSelectedFile] = useState<FileCustom[] | undefined>(
    undefined
  );
  const [isTouched, setIsTouched] = useState(false);
  let errorMessage = "";

  let valueIsValid = validateValue(selectedFile);
  const hasError =
    (!valueIsValid || typeof valueIsValid === "string") && isTouched;

  if (hasError) {
    errorMessage = valueIsValid as string;
    valueIsValid = false;
  }

  const valueChangeHandler = (newValue: FileCustom[] | undefined) => {
    setSelectedFile(newValue);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setSelectedFile(undefined);
    setIsTouched(false);
  };

  return {
    selectedFile,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
    errorMessage,
    setSelectedFile,
  };
};

export default useFileInput;
