/** @format */
import Input, { InputTheme, InputType } from "@/components/ui/input";
import classes from "./create-customer-modal.module.css";
import useInput from "@/hooks/use-input";
import {
  ifEnteredMustBeEmail,
  isNotEmpty,
  validateMobilePhoneNumber,
} from "@/util/field-validations";
import { maskMobilePhoneNumber } from "@/util/mask-functions";
import { useContext, useState } from "react";
import { CreateCustomerRequest } from "@/models/customers/CreateCustomerRequest";
import { createCustomer } from "@/api/customers/customersApi";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button, { ButtonStyle } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";

const CreateCustomerModalContent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  if (status === "unauthenticated") {
    router && router.replace("/entrar");
  }

  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
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

  const handleSubmit = async () => {
    if (!enteredNameIsValid || !enteredEmailIsValid || !enteredEmailIsValid) {
      return;
    }

    setIsLoading(true);

    const request = new CreateCustomerRequest(
      enteredName,
      enteredPhoneNumber,
      undefined,
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
      router.replace(`/clientes/editar/${response.body.customerId}`);
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
              hasError={nameInputHasError}
              errorMessage={"O nome do cliente é inválido"}
              value={enteredName}
              onChangeHandler={nameChangedHandler}
              onBlurHandler={nameBlurHandler}
              inputTheme={InputTheme.SECONDARY}
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
              inputTheme={InputTheme.SECONDARY}
            />
          </div>
        </div>
        <div className={classes.action_group}>
          <div>
            <Input
              type={InputType.EMAIL}
              label={"E-mail (opcional)"}
              id={"customer-email"}
              hasError={phoneNumberInputHasError}
              errorMessage={"O e-mail do cliente é inválido"}
              value={enteredEmail}
              onChangeHandler={emailChangedHandler}
              onBlurHandler={emailBlurHandler}
              inputTheme={InputTheme.SECONDARY}
            />
          </div>
          <div className={classes.actions}>
            <div>
              <Button style={ButtonStyle.SUCCESS} onClickHandler={handleSubmit}>
                Criar
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default CreateCustomerModalContent;
