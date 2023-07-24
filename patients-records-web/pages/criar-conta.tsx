/** @format */

import { createAccount } from "@/api/authnz";
import Button, { ButtonStyle } from "@/components/ui/button";
import ErrorDialog from "@/components/ui/error-dialog";
import Input, { InputType } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useInput from "@/hooks/use-input";
import { ErrorDetails } from "@/models/Api/ErrorDetails";
import { CreateUserRequest } from "@/models/users/CreateUserRequest";
import { NotificationContext } from "@/store/notification-context";
import classes from "@/styles/CriarConta.module.css";
import {
  isEmail,
  isNotEmpty,
  isPassword,
  isPasswordConfirmation,
} from "@/util/field-validations";

import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

const CriarConta = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [error, setError] = useState<ErrorDetails | null>(null);
  const notificationCtx = useContext(NotificationContext);

  const {
    value: enteredCompanyName,
    isValid: enteredCompanyNameIsValid,
    hasError: businessNameInputHasError,
    valueChangeHandler: businessNameChangedHandler,
    inputBlurHandler: businessNameBlurHandler,
    reset: resetCompanyNameInput,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput({ validateValue: isEmail });

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: usernameChangedHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput({ validateValue: isPassword });

  const {
    value: enteredPasswordConfirmation,
    isValid: enteredPasswordConfirmationIsValid,
    hasError: passwordConfirmationInputHasError,
    valueChangeHandler: passwordConfirmationChangedHandler,
    inputBlurHandler: passwordConfirmationBlurHandler,
    reset: resetPasswordConfirmationInput,
    errorMessage: errorMessagePasswordConfirmation,
  } = useInput({
    validateValue: isPasswordConfirmation,
    secondValueValidationFunction: enteredPassword,
  });

  let formIsValid = false;

  if (
    enteredCompanyNameIsValid &&
    enteredEmailIsValid &&
    enteredUsernameIsValid &&
    enteredPasswordIsValid &&
    enteredPasswordConfirmationIsValid
  ) {
    formIsValid = true;
  }

  const onSubmitHandler = async (event: any) => {
    event.preventDefault();

    if (
      !enteredCompanyNameIsValid ||
      !enteredEmailIsValid ||
      !enteredUsernameIsValid ||
      !enteredPasswordIsValid ||
      !enteredPasswordConfirmationIsValid
    ) {
      return;
    }

    setIsLoading(true);

    const request = new CreateUserRequest(
      enteredEmail,
      enteredUsername,
      enteredPassword,
      enteredCompanyName
    );

    const response = await createAccount(request);

    if (response.ok) {
      resetCompanyNameInput();
      resetEmailInput();
      resetUsernameInput();
      resetPasswordInput();
      resetPasswordConfirmationInput();
      const notification = {
        status: "success",
        title: "Conta Criada!",
        message: "Agora insira suas credenciais e acesse a plataforma!",
      };
      notificationCtx.showNotification(notification);
      router.push("/entrar");
    } else {
      setError(response.error!);
    }

    setIsLoading(false);
  };

  const socialLoginSubmitHandler = async () => {};

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && (
        <ErrorDialog
          onClose={() => {
            setError(null);
          }}
          title={"Opsss..."}
          error={error}
        />
      )}
      <div className={classes.content}>
        <section className={classes.content_left}>
          <form
            className={classes.content_left_form}
            onSubmit={onSubmitHandler}
          >
            <p className={classes.content_left_title}>Crie Sua Conta</p>

            <div className={classes.actions}>
              <Input
                type={InputType.TEXT}
                label={"Nome do seu empreendimento:"}
                id={"company-name"}
                hasError={businessNameInputHasError}
                errorMessage="O nome do seu negócio é inválido"
                placeholder="Ex.: Salão da Ana"
                value={enteredCompanyName}
                onChangeHandler={businessNameChangedHandler}
                onBlurHandler={businessNameBlurHandler}
              />
            </div>
            <div className={classes.actions}>
              <Input
                type={InputType.EMAIL}
                label={"E-mail:"}
                id={"email"}
                hasError={emailInputHasError}
                errorMessage="Email inválido"
                placeholder="Ex.: anamaria@meunegocio.com"
                value={enteredEmail}
                onChangeHandler={emailChangedHandler}
                onBlurHandler={emailBlurHandler}
              />
            </div>
            <div className={classes.actions}>
              <Input
                type={InputType.TEXT}
                label={"Nome de usuário:"}
                id={"username"}
                hasError={usernameInputHasError}
                errorMessage="Nome de usuário inválido"
                placeholder="Ex.: Ana Maria"
                value={enteredUsername}
                onChangeHandler={usernameChangedHandler}
                onBlurHandler={usernameBlurHandler}
              />
            </div>
            <div className={classes.actions}>
              <Input
                type={InputType.TEXT}
                label={"Senha:"}
                id={"password"}
                errorMessage="Senha inválida"
                hasError={passwordInputHasError}
                placeholder="Ex.: 02091945@MeuNegocio"
                value={enteredPassword}
                onChangeHandler={passwordChangedHandler}
                onBlurHandler={passwordBlurHandler}
              />
            </div>
            <div className={classes.actions}>
              <Input
                type={InputType.TEXT}
                label={"Confirme sua Senha:"}
                id={"password-confirmation"}
                hasError={passwordConfirmationInputHasError}
                errorMessage={errorMessagePasswordConfirmation}
                placeholder="Ex.: 02091945@MeuNegocio"
                value={enteredPasswordConfirmation}
                onChangeHandler={passwordConfirmationChangedHandler}
                onBlurHandler={passwordConfirmationBlurHandler}
              />
            </div>
            <div className={classes.actions_button}>
              <Button
                type="submit"
                disabled={!formIsValid || isLoading}
                style={ButtonStyle.SUCCESS}
              >
                Criar
              </Button>
            </div>
          </form>
        </section>
        <section className={classes.content_rigth}>
          <form
            className={classes.content_rigth_form}
            onSubmit={socialLoginSubmitHandler}
          >
            <p className={classes.content_right_title}>
              Você também pode usar sua rede social favorita:
            </p>

            <button className={classes.content_right_button}>
              Crie sua conta usando o Facebook
              <Image
                src={`/images/Facebook.svg`}
                alt="Facebook Logo Image"
                width={77}
                height={77}
              />
            </button>

            <button className={classes.content_right_button}>
              Crie sua conta usando o Google
              <Image
                src={`/images/Google.svg`}
                alt="Google Logo Image"
                width={77}
                height={77}
              />
            </button>

            <button className={classes.content_right_button}>
              Crie sua conta usando o Instagram
              <Image
                src={`/images/Instagram.svg`}
                alt="Instagram Logo Image"
                width={77}
                height={77}
              />
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default CriarConta;
