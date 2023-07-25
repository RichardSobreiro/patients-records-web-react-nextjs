/** @format */
import Input, { InputType } from "@/components/ui/input";
import classes from "./personal-info.module.css";
import Button, { ButtonStyle } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/store/notification-context";
import useInput from "@/hooks/use-input";
import {
  ifEnteredMustBeEmail,
  isNotEmpty,
  validateMobilePhoneNumber,
} from "@/util/field-validations";
import { maskMobilePhoneNumber } from "@/util/mask-functions";
import { getCustomerById, updateCustomer } from "@/api/customers/customersApi";
import { GetCustomerByIdResponse } from "@/models/customers/GetCustomerByIdResponse";
import { UpdateCustomerRequest } from "@/models/customers/UpdateCustomerRequest";
import { UpdateCustomerResponse } from "@/models/customers/UpdateCustomerResponse";
import LoadingSpinner from "@/components/ui/loading-spinner";

type Props = {
  customerId: string;
};

const PersonalInfo = ({ customerId }: Props) => {
  const { data: session, status, update } = useSession();
  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

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
    value: birthdate,
    isValid: birthdateIsValid,
    hasError: birthdateInputHasError,
    valueChangeHandler: birthdateChangedHandler,
    inputBlurHandler: birthdateBlurHandler,
    reset: resetbirthdateInput,
    setEnteredValue: setBirthdate,
  } = useInput({ validateValue: isNotEmpty });

  const getCustomerByIdAsync = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getCustomerById(
          userCustom.accessToken,
          customerId
        );
        if (response.ok) {
          const customerResponse = response.body as GetCustomerByIdResponse;
          setCustomerName(customerResponse.customerName);
          setPhoneNumber(customerResponse.phoneNumber);
          customerResponse.birthDate &&
            setBirthdate(
              new Date(customerResponse.birthDate).toISOString().split("T")[0]
            );
          customerResponse.email && setEmail(customerResponse.email);
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
  }, [userCustom?.accessToken, customerId]);

  useEffect(() => {
    setIsLoading(true);

    if (userCustom?.accessToken && customerId) {
      getCustomerByIdAsync();
    }
  }, [userCustom?.accessToken, customerId]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (
      !birthdateIsValid ||
      !enteredEmailIsValid ||
      !enteredPhoneNumberIsValid ||
      !enteredCustomerNameIsValid
    ) {
      birthdateBlurHandler(undefined);
      return;
    }

    setIsLoading(true);

    const birthDateObject = new Date(birthdate.replace(/-/g, "/"));

    const request = new UpdateCustomerRequest(
      customerId,
      enteredCustomerName,
      enteredPhoneNumber,
      birthDateObject,
      enteredEmail
    );

    const response = await updateCustomer(userCustom.accessToken, request);

    if (response.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "Informações alteradas com sucesso!",
      };
      notificationCtx.showNotification(notification);
      const updateCustomerResponse = response.body as UpdateCustomerResponse;
      setCustomerName(updateCustomerResponse.customerName);
      setPhoneNumber(updateCustomerResponse.phoneNumber);
      updateCustomerResponse.email && setEmail(updateCustomerResponse.email);
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

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <article className={classes.personal_info_container}>
        <div className={classes.action_group}>
          <div>
            <Input
              type={InputType.TEXT}
              label={"Nome"}
              id={"customer-name"}
              hasError={customerNameInputHasError}
              errorMessage={"O nome do cliente é inválido"}
              value={enteredCustomerName}
              onChangeHandler={customerNameChangedHandler}
              onBlurHandler={customerNameBlurHandler}
            />
          </div>
          <div>
            <Input
              type={InputType.TEXT}
              label={"Telefone"}
              id={"customer-phone-number"}
              hasError={phoneNumberInputHasError}
              errorMessage={"O telefone do cliente é inválido"}
              value={enteredPhoneNumber}
              onChangeHandler={phoneNumberChangedHandler}
              onBlurHandler={phoneNumberBlurHandler}
            />
          </div>
          <div>
            <Input
              type={InputType.EMAIL}
              label={"E-mail (opcional)"}
              id={"customer-email"}
              hasError={emailInputHasError}
              errorMessage={"O e-mail do cliente é inválido"}
              value={enteredEmail}
              onChangeHandler={emailChangedHandler}
              onBlurHandler={emailBlurHandler}
            />
          </div>
          <div>
            <Input
              type={InputType.DATE}
              label={"Data de Aniversário"}
              id={"anamnesis-birthdate-create"}
              hasError={birthdateInputHasError}
              errorMessage={"A data de aniversário é inválida"}
              value={birthdate}
              onChangeHandler={birthdateChangedHandler}
              onBlurHandler={birthdateBlurHandler}
            />
          </div>
          <div className={classes.actions}>
            <Button
              type="button"
              style={ButtonStyle.SUCCESS}
              onClickHandler={handleSubmit}
            >
              Alterar
            </Button>
          </div>
        </div>
      </article>
    </>
  );
};

export default PersonalInfo;
