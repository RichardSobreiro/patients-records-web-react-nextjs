/** @format */

import { useState } from "react";

type Props = {
  validateValue: (input?: File[] | undefined) => boolean | string;
};

const useFileInput = ({ validateValue }: Props) => {
  const [selectedPhotos, setSelectedPhotos] = useState<File[] | undefined>(
    undefined
  );
  const [isTouched, setIsTouched] = useState(false);
  let errorMessage = "";

  let valueIsValid = validateValue(selectedPhotos);
  const hasError =
    (!valueIsValid || typeof valueIsValid === "string") && isTouched;

  if (hasError) {
    errorMessage = valueIsValid as string;
    valueIsValid = false;
  }

  const valueChangeHandler = (newValue: File[] | undefined) => {
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
  };
};

export default useFileInput;
