/** @format */

import Step1 from "@/components/customers/edit/step1";
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
import { useCallback, useContext, useEffect, useState } from "react";
import Step2 from "@/components/customers/edit/step2";
import useDropdown from "@/hooks/use-dropdown";
import Step3 from "@/components/customers/edit/step3";
import Head from "next/head";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { CreateCustomerRequest } from "@/models/customers/CreateCustomerRequest";
import { CreateAnamneseRequest } from "@/models/customers/CreateAnamneseRequest";
import { createCustomer, getCustomerById } from "@/api/customers/customersApi";
import { useSession } from "next-auth/react";
import { NotificationContext } from "@/store/notification-context";
import { GetCustomerByIdResponse } from "@/models/customers/GetCustomerByIdResponse";
import { genderList } from "@/util/constants/lists";
import { Item } from "@/components/ui/dropdown";

const EditarCliente = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [customer, setCustomer] = useState<GetCustomerByIdResponse>();

  if (status === "unauthenticated") {
    router && router.replace("/entrar");
  }

  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Active, setStep1Active] = useState<boolean>(true);
  const [step2Active, setStep2Active] = useState<boolean>(false);
  const [step3Active, setStep3Active] = useState<boolean>(false);

  const [step1Visited, setStep1Visited] = useState<boolean>(true);
  const [step2Visited, setStep2Visited] = useState<boolean>(false);
  const [step3Visited, setStep3Visited] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    value: enteredCustomerName,
    isValid: enteredCustomerNameIsValid,
    hasError: customerNameInputHasError,
    valueChangeHandler: customerNameChangedHandler,
    inputBlurHandler: customerNameBlurHandler,
    reset: resetCustomerNameInput,
    setEnteredValue: setCustomerName,
  } = useInput({
    validateValue: isNotEmpty,
  });

  const {
    value: enteredPhoneNumber,
    isValid: enteredPhoneNumberIsValid,
    hasError: phoneNumberInputHasError,
    valueChangeHandler: phoneNumberChangedHandler,
    inputBlurHandler: phoneNumberBlurHandler,
    reset: resetPhoneNumberInput,
    setEnteredValue: setPhoneNumber,
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
    setEnteredValue: setEmail,
  } = useInput({ validateValue: ifEnteredMustBeEmail });

  const {
    value: enteredBirthdate,
    isValid: enteredBirthdateIsValid,
    hasError: birthdateInputHasError,
    valueChangeHandler: birthdateChangedHandler,
    inputBlurHandler: birthdateBlurHandler,
    reset: resetBirthdateInput,
    setEnteredValue: setBirthdate,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: selectedGender,
    isValid: selectedGenderIsValid,
    hasError: selectedGenderInputHasError,
    valueChangeHandler: selectedGenderChangeHandler,
    inputBlurHandler: selectedGenderBlurHandler,
    reset: resetSelectedGender,
    errorMessage: selectedGenderErrorMessage,
    setItem: selectedGenderSetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: selectedEthnicity,
    isValid: selectedEthnicityIsValid,
    hasError: selectedEthnicityInputHasError,
    valueChangeHandler: selectedEthnicityChangeHandler,
    inputBlurHandler: selectedEthnicityBlurHandler,
    reset: resetSelectedEthnicity,
    errorMessage: selectedEthnicityErrorMessage,
    setItem: selectedEthnicitySetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: selectedMaritalStatus,
    isValid: selectedMaritalStatusIsValid,
    hasError: selectedMaritalStatusInputHasError,
    valueChangeHandler: selectedMaritalStatusChangeHandler,
    inputBlurHandler: selectedMaritalStatusBlurHandler,
    reset: resetSelectedMaritalStatus,
    errorMessage: selectedMaritalStatusErrorMessage,
    setItem: selectedMaritalStatusSetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: selectedEmploymentStatus,
    isValid: selectedEmploymentStatusIsValid,
    hasError: selectedEmploymentStatusInputHasError,
    valueChangeHandler: selectedEmploymentStatusChangeHandler,
    inputBlurHandler: selectedEmploymentStatusBlurHandler,
    reset: resetSelectedEmploymentStatus,
    errorMessage: selectedEmploymentStatusErrorMessage,
    setItem: selectedEmploymentStatusSetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: enteredComments,
    isValid: enteredCommentsIsValid,
    hasError: enteredCommentsInputHasError,
    valueChangeHandler: enteredCommentsChangedHandler,
    inputBlurHandler: enteredCommentsBlurHandler,
    reset: resetEnteredCommentsInput,
  } = useInput({ validateValue: () => true });

  const step1IsValid =
    enteredCustomerNameIsValid &&
    enteredPhoneNumberIsValid &&
    enteredEmailIsValid;

  const step2IsValid = enteredBirthdateIsValid;
  const step3IsValid = true;

  const toggleSteps = (step: number) => {
    if (step < 1) {
      step = 1;
    }
    if (step > 4) {
      step = 4;
    }

    if (currentStep === 1 && !step1IsValid) {
      customerNameBlurHandler("");
      phoneNumberBlurHandler("");
      emailBlurHandler("");
      return;
    } else if (currentStep === 2 && !step2IsValid) {
      birthdateBlurHandler("");
      return;
    }
    switch (step) {
      case 1:
        setCurrentStep(1);
        setStep1Visited(true);
        setStep1Active(true);
        setStep2Active(false);
        setStep3Active(false);
        break;
      case 2:
        setCurrentStep(2);
        setStep1Active(false);
        setStep2Active(true);
        setStep2Visited(true);
        setStep3Active(false);
        break;
      case 3:
        setCurrentStep(3);
        setStep1Active(false);
        setStep2Active(false);
        setStep3Active(true);
        setStep3Visited(true);
        break;
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!step1IsValid || !step2IsValid || !step3IsValid) return;

    setIsLoading(true);

    const birthDateObject = new Date(enteredBirthdate.replace(/-/g, "/"));

    const request = new CreateCustomerRequest(
      enteredCustomerName,
      enteredPhoneNumber,
      new CreateAnamneseRequest(
        birthDateObject,
        selectedGender?.value.description,
        selectedEthnicity?.value.description,
        selectedMaritalStatus?.value.description,
        selectedEmploymentStatus?.value.description,
        enteredComments
      ),
      enteredEmail
    );

    const response = await createCustomer(userCustom.accessToken, request);

    if (response.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "Seu cliente foi criado!",
      };
      notificationCtx.showNotification(notification);
      router.replace("/clientes");
    } else {
      const notification = {
        status: "error",
        title: "Opsss...",
        message:
          "Tivemos um problema passageiro. Aguarde alguns segundos e tente novamente!",
      };
      notificationCtx.showNotification(notification);
    }

    setIsLoading(false);
  };

  const getCustomerByIdAsync = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getCustomerById(
          userCustom.accessToken,
          router!.query!.customerId! as string
        );
        if (response.ok) {
          const customerResponse = response.body as GetCustomerByIdResponse;
          setCustomer(customerResponse);
          setCustomerName(customerResponse.customerName);
          setPhoneNumber(customerResponse.phoneNumber);
          customerResponse.email && setEmail(customerResponse.email);
          if (
            customerResponse.anamneses &&
            customerResponse.anamneses.length === 1
          ) {
            setBirthdate(
              new Date(customerResponse.anamneses![0].birthDate)
                .toISOString()
                .split("T")[0]
            );
            const gender = genderList.find(
              (item) =>
                item.description === customerResponse.anamneses![0].gender
            );
            const tempSelectedGender = {
              id: gender?.id,
              description: gender?.description,
              selected: true,
              value: gender,
            };
            selectedGenderSetItem(tempSelectedGender as unknown as Item);
          }
        }
      } catch (error: any) {
        const notification = {
          status: "error",
          title: "Opsss...",
          message:
            "Tivemos um problema passageiro. Aguarde alguns segundos e tente novamente!",
        };
        notificationCtx.showNotification(notification);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userCustom?.accessToken, router.query.customerId]);

  useEffect(() => {
    setIsLoading(true);

    if (userCustom?.accessToken && router?.query?.customerId) {
      getCustomerByIdAsync();
    }
  }, [userCustom?.accessToken, router.query.customerId]);

  return (
    <>
      <Head>
        <title>Editar Cliente</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading && <LoadingSpinner />}
      <div className={classes.container}>
        <section className={classes.steps}>
          <div
            style={
              !step1IsValid && step1Visited
                ? { backgroundColor: "#ff4e4e" }
                : {}
            }
            className={`${classes.step} ${
              step1Active ? classes.step_active : ""
            }`}
            onClick={() => toggleSteps(1)}
          >
            1
          </div>
          <div
            style={
              !step2IsValid && step2Visited
                ? { backgroundColor: "#ff4e4e" }
                : {}
            }
            className={`${classes.step} ${
              step2Active ? classes.step_active : ""
            }`}
            onClick={() => toggleSteps(2)}
          >
            2
          </div>
          <div
            style={
              !step3IsValid && step3Visited
                ? { backgroundColor: "#ff4e4e" }
                : {}
            }
            className={`${classes.step} ${
              step3Active ? classes.step_active : ""
            }`}
            onClick={() => toggleSteps(3)}
          >
            3
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
          {step2Active && (
            <Step2
              enteredBirthdate={enteredBirthdate}
              birthdateInputHasError={birthdateInputHasError}
              birthdateChangedHandler={birthdateChangedHandler}
              birthdateBlurHandler={birthdateBlurHandler}
              selectedGender={selectedGender}
              selectedGenderInputHasError={selectedGenderInputHasError}
              selectedGenderChangeHandler={selectedGenderChangeHandler}
              selectedGenderBlurHandler={selectedGenderBlurHandler}
              selectedEthnicity={selectedEthnicity}
              selectedEthnicityInputHasError={selectedEthnicityInputHasError}
              selectedEthnicityChangeHandler={selectedEthnicityChangeHandler}
              selectedEthnicityBlurHandler={selectedEthnicityBlurHandler}
              selectedMaritalStatus={selectedMaritalStatus}
              selectedMaritalStatusInputHasError={
                selectedMaritalStatusInputHasError
              }
              selectedMaritalStatusChangeHandler={
                selectedMaritalStatusChangeHandler
              }
              selectedMaritalStatusBlurHandler={
                selectedMaritalStatusBlurHandler
              }
              selectedEmploymentStatus={selectedEmploymentStatus}
              selectedEmploymentStatusInputHasError={
                selectedEmploymentStatusInputHasError
              }
              selectedEmploymentStatusChangeHandler={
                selectedEmploymentStatusChangeHandler
              }
              selectedEmploymentStatusBlurHandler={
                selectedEmploymentStatusBlurHandler
              }
              enteredComments={enteredComments}
              enteredCommentsInputHasError={enteredCommentsInputHasError}
              enteredCommentsChangedHandler={enteredCommentsChangedHandler}
              enteredCommentsBlurHandler={enteredCommentsBlurHandler}
            />
          )}
          {step3Active && (
            <Step3
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
              enteredBirthdate={enteredBirthdate}
              birthdateInputHasError={birthdateInputHasError}
              birthdateChangedHandler={birthdateChangedHandler}
              birthdateBlurHandler={birthdateBlurHandler}
            />
          )}
          <div className={classes.actions}>
            <Button
              style={ButtonStyle.NEUTRAL}
              onClickHandler={() => toggleSteps(currentStep - 1)}
            >
              Voltar
            </Button>
            {step3Active && step3IsValid ? (
              <Button
                type="submit"
                style={ButtonStyle.SUCCESS}
                onClickHandler={handleSubmit}
              >
                Salvar
              </Button>
            ) : (
              <Button
                style={ButtonStyle.SECONDARY_BORDERED}
                onClickHandler={() => toggleSteps(currentStep + 1)}
              >
                Avançar
              </Button>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default EditarCliente;
