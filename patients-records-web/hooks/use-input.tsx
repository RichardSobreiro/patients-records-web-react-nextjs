/** @format */

import { useState } from "react";

type Props = {
  validateValue: (
    input: any,
    setErrorMessage?: any,
    mustMatchWith?: any
  ) => boolean | string;
  mustMatchWith?: string;
};

const useInput = ({ validateValue, mustMatchWith }: Props) => {
  const [enteredValue, setEnteredValue] = useState<string>("");
  const [isTouched, setIsTouched] = useState(false);
  let errorMessage = "";

  const valueIsValid = validateValue(enteredValue, mustMatchWith);
  const hasError =
    (!valueIsValid || typeof valueIsValid === "string") && isTouched;

  if (hasError) {
    errorMessage = valueIsValid as string;
  }

  const valueChangeHandler = (event: any) => {
    setEnteredValue(event.target.value);
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
  };
};

export default useInput;
