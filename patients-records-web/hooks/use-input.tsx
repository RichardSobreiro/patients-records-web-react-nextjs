/** @format */

import { useState } from "react";

type Props = {
  validateValue: (
    input?: any | string,
    setErrorMessage?: any,
    mustMatchWith?: any
  ) => boolean | string;
  mustMatchWith?: string;
  initialValue?: string;
  maskFunction?: (value: string) => string;
};

const useInput = ({
  validateValue,
  mustMatchWith,
  initialValue,
  maskFunction,
}: Props) => {
  const [enteredValue, setEnteredValue] = useState<string>(initialValue ?? "");
  const [isTouched, setIsTouched] = useState(false);
  let errorMessage = "";

  let valueIsValid = validateValue(enteredValue, mustMatchWith);
  const hasError =
    (!valueIsValid || typeof valueIsValid === "string") && isTouched;

  if (hasError) {
    errorMessage = valueIsValid as string;
    valueIsValid = false;
  }

  const valueChangeHandler = (event: any) => {
    if (maskFunction) {
      const maskedValue = maskFunction(event.target.value);
      setEnteredValue(maskedValue);
    } else {
      setEnteredValue(event.target.value);
    }
  };

  const inputBlurHandler = (event: any) => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
    errorMessage,
    setEnteredValue,
  };
};

export default useInput;
