/** @format */

import { Item } from "@/components/ui/dropdown";
import { useState } from "react";

type Props = {
  validateValue: (input?: Item, setErrorMessage?: any) => boolean | string;
};

const useDropdown = ({ validateValue }: Props) => {
  const [item, setItem] = useState<Item>();
  const [isTouched, setIsTouched] = useState(false);
  let errorMessage = "";

  let valueIsValid = validateValue(item);
  const hasError =
    (!valueIsValid || typeof valueIsValid === "string") && isTouched;

  if (hasError) {
    errorMessage = valueIsValid as string;
    valueIsValid = false;
  }

  const valueChangeHandler = (itemParam: Item | undefined) => {
    setItem(itemParam);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setItem(undefined);
    setIsTouched(false);
  };

  return {
    value: item,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
    errorMessage,
    setItem,
  };
};

export default useDropdown;
