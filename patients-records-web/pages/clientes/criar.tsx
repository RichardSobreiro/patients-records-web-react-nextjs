/** @format */

import Step1 from "@/components/customers/create/step1";
import Button, { ButtonStyle } from "@/components/ui/button";
import useInput from "@/hooks/use-input";
import classes from "@/styles/customers/Criar.module.css";
import {
  ifEnteredMustBeEmail,
  isNotEmpty,
  validateMobilePhoneNumber,
} from "@/util/field-validations";
import { maskMobilePhoneNumber } from "@/util/mask-functions";

import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

const CriarCliente = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Active, setStep1Active] = useState<boolean>(true);
  const [step2Active, setStep2Active] = useState<boolean>(false);
  const [step3Active, setStep3Active] = useState<boolean>(false);
  const [step4Active, setStep4Active] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    value: enteredCustomerName,
    isValid: enteredCustomerNameIsValid,
    hasError: customerNameInputHasError,
    valueChangeHandler: customerNameChangedHandler,
    inputBlurHandler: customerNameBlurHandler,
    reset: resetCustomerNameInput,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: enteredPhoneNumber,
    isValid: enteredPhoneNumberIsValid,
    hasError: phoneNumberInputHasError,
    valueChangeHandler: phoneNumberChangedHandler,
    inputBlurHandler: phoneNumberBlurHandler,
    reset: resetPhoneNumberInput,
  } = useInput({
    validateValue: validateMobilePhoneNumber,
    maskFunction: maskMobilePhoneNumber,
  });

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput({ validateValue: ifEnteredMustBeEmail });

  const {
    value: enteredBirthdate,
    isValid: enteredBirthdateIsValid,
    hasError: birthdateInputHasError,
    valueChangeHandler: birthdateChangedHandler,
    inputBlurHandler: birthdateBlurHandler,
    reset: resetBirthdateInput,
  } = useInput({ validateValue: isNotEmpty });

  const step1IsValid =
    enteredCustomerNameIsValid &&
    enteredPhoneNumberIsValid &&
    enteredEmailIsValid &&
    enteredBirthdateIsValid;

  const toggleSteps = (step: number) => {
    if (currentStep === 1 && !step1IsValid) {
      customerNameBlurHandler("");
      phoneNumberBlurHandler("");
      emailBlurHandler("");
      birthdateBlurHandler("");
      return;
    }
    switch (step) {
      case 1:
        setCurrentStep(1);
        setStep1Active(true);
        setStep2Active(false);
        setStep3Active(false);
        setStep4Active(false);
        break;
      case 2:
        setCurrentStep(2);
        setStep1Active(false);
        setStep2Active(true);
        setStep3Active(false);
        setStep4Active(false);
        break;
      case 3:
        setCurrentStep(3);
        setStep1Active(false);
        setStep2Active(false);
        setStep3Active(true);
        setStep4Active(false);
        break;
      case 4:
        setCurrentStep(4);
        setStep1Active(false);
        setStep2Active(false);
        setStep3Active(false);
        setStep4Active(true);
        break;
    }
  };

  return (
    <div className={classes.container}>
      <section className={classes.steps}>
        <div
          style={!step1IsValid ? { backgroundColor: "#ff4e4e" } : {}}
          className={`${classes.step} ${
            step1Active ? classes.step_active : ""
          }`}
          onClick={() => toggleSteps(1)}
        >
          1
        </div>
        <div
          className={`${classes.step} ${
            step2Active ? classes.step_active : ""
          }`}
          onClick={() => toggleSteps(2)}
        >
          2
        </div>
        <div
          className={`${classes.step} ${
            step3Active ? classes.step_active : ""
          }`}
          onClick={() => toggleSteps(3)}
        >
          3
        </div>
        <div
          className={`${classes.step} ${
            step4Active ? classes.step_active : ""
          }`}
          onClick={() => toggleSteps(4)}
        >
          4
        </div>
      </section>
      <section className={classes.steps_container}>
        {step1Active && (
          <Step1
            enteredCustomerName={enteredCustomerName}
            customerNameInputHasError={customerNameInputHasError}
            customerNameChangedHandler={customerNameChangedHandler}
            customerNameBlurHandler={customerNameBlurHandler}
            enteredCustomerPhoneNumber={enteredPhoneNumber}
            customerPhoneNumberInputHasError={phoneNumberInputHasError}
            customerPhoneNumberChangedHandler={phoneNumberChangedHandler}
            customerPhoneNumberBlurHandler={phoneNumberBlurHandler}
            enteredCustomerEmail={enteredEmail}
            customerEmailInputHasError={emailInputHasError}
            customerEmailChangedHandler={emailChangedHandler}
            customerEmailBlurHandler={emailBlurHandler}
            enteredCustomerBirthdate={enteredBirthdate}
            customerBirthdateInputHasError={birthdateInputHasError}
            customerBirthdateChangedHandler={birthdateChangedHandler}
            customerBirthdateBlurHandler={birthdateBlurHandler}
          />
        )}
        <div className={classes.actions}>
          <Button
            style={ButtonStyle.NEUTRAL}
            onClickHandler={() => toggleSteps(1)}
          >
            Voltar
          </Button>
          <Button
            style={ButtonStyle.SECONDARY_BORDERED}
            onClickHandler={() => toggleSteps(2)}
          >
            Avançar
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CriarCliente;
