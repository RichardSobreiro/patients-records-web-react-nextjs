/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import Input, { InputType } from "@/components/ui/input";
import useInput from "@/hooks/use-input";
import classes from "@/styles/CriarConta.module.css";

import Image from "next/image";
import { useState } from "react";

const isNotEmpty = (value: any) => value.trim() !== "";
const isEmail = (value: any) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    return true;
  } else {
    return false;
  }
};
const isPassword = (value: any) => {
  if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)) {
    return true;
  } else {
    return false;
  }
};
const isPasswordConfirmation = (value: any, mustMatchWith?: string) => {
  let returnValue: boolean | string = false;
  if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)) {
    returnValue = true;
  } else {
    return "Senha Inválida!";
  }

  if (value === mustMatchWith) {
    returnValue = true;
  } else {
    returnValue =
      "A senha de confirmação difere da senha fornecida no campo acima";
  }
  return returnValue;
};

const CriarConta = () => {
  const {
    value: enteredBusinessName,
    isValid: enteredBusinessNameIsValid,
    hasError: businessNameInputHasError,
    valueChangeHandler: businessNameChangedHandler,
    inputBlurHandler: businessNameBlurHandler,
    reset: resetBusinessNameInput,
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
    mustMatchWith: enteredPassword,
  });

  let formIsValid = false;

  if (
    enteredBusinessNameIsValid &&
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
      !enteredBusinessNameIsValid ||
      !enteredEmailIsValid ||
      !enteredUsernameIsValid ||
      !enteredPasswordIsValid ||
      !enteredPasswordConfirmationIsValid
    ) {
      return;
    }

    console.log(enteredBusinessName);

    resetBusinessNameInput();
    resetEmailInput();
    resetUsernameInput();
    resetPasswordInput();
    resetPasswordConfirmationInput();
  };

  const socialLoginSubmitHandler = async () => {};

  return (
    <div className={classes.content}>
      <section className={classes.content_left}>
        <form className={classes.content_left_form} onSubmit={onSubmitHandler}>
          <p className={classes.content_left_title}>Crie Sua Conta</p>

          <div className={classes.actions}>
            <Input
              type={InputType.TEXT}
              label={"Nome do seu empreendimento:"}
              id={"company-name"}
              hasError={businessNameInputHasError}
              errorMessage="O nome do seu negócio é inválido"
              placeholder="Ex.: Salão da Ana"
              value={enteredBusinessName}
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
              disabled={!formIsValid}
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
  );
};

export default CriarConta;
