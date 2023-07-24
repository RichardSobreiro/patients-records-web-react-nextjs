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
  const [selectedPhotos, setSelectedPhotos] = useState<
    FileCustom[] | undefined
  >(undefined);
  const [isTouched, setIsTouched] = useState(false);
  let errorMessage = "";

  let valueIsValid = validateValue(selectedPhotos);
  const hasError =
    (!valueIsValid || typeof valueIsValid === "string") && isTouched;

  if (hasError) {
    errorMessage = valueIsValid as string;
    valueIsValid = false;
  }

  const valueChangeHandler = (newValue: FileCustom[] | undefined) => {
    setSelectedPhotos(newValue);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setSelectedPhotos(undefined);
    setIsTouched(false);
  };

  return {
    selectedPhotos,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
    errorMessage,
    setSelectedPhotos,
  };
};

export default useFileInput;
