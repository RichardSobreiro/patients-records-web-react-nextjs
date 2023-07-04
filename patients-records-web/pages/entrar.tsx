/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import Input, { InputType } from "@/components/ui/input";
import classes from "@/styles/Entrar.module.css";
import { isNotEmpty, isPassword } from "@/util/field-validations";
import useInput from "@/hooks/use-input";
import { useContext, useState } from "react";
import { ErrorDetails } from "@/models/Api/ErrorDetails";
import { NotificationContext } from "@/store/notification-context";
import { LoginRequest } from "@/models/login/login-request";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorDialog from "@/components/ui/error-dialog";

import { useRouter } from "next/router";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Entrar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  const {
    value: enteredUsernameEmail,
    isValid: enteredUsernameEmailIsValid,
    hasError: enteredUsernameEmailInputHasError,
    valueChangeHandler: enteredUsernameEmailChangedHandler,
    inputBlurHandler: enteredUsernameEmailBlurHandler,
    reset: resetEnteredUsernameEmailInput,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: enteredPasswordInputHasError,
    valueChangeHandler: enteredPasswordChangedHandler,
    inputBlurHandler: enteredPasswordBlurHandler,
    reset: resetEnteredPasswordInput,
    errorMessage: enteredPasswordErrorMessage,
  } = useInput({ validateValue: isPassword });

  const loginSubmitHandler = async (event: any) => {
    event?.preventDefault();

    if (!enteredUsernameEmailIsValid || !enteredPasswordIsValid) return;

    setIsLoading(true);

    const request = new LoginRequest(enteredUsernameEmail, enteredPassword);

    let callbackUrl =
      router.query.callbackUrl && !Array.isArray(router.query.callbackUrl)
        ? router.query.callbackUrl
        : "/agenda";
    // const response = await login(request);
    const response = await signIn("credentials", {
      redirect: false,
      email: enteredUsernameEmail,
      password: enteredPassword,
      callbackUrl,
    });

    if (!response?.error) {
      resetEnteredUsernameEmailInput();
      resetEnteredPasswordInput();
      if (callbackUrl === "/informacoes-adicionais") {
        const notification = {
          status: "pending",
          title: "Estamos quase lá...",
          message: "Complemente o seu cadastro e tenha acesso a plataforma!",
        };
        notificationCtx.showNotification(notification);
      }
      router.replace(callbackUrl);
    } else {
      const errorDetails: ErrorDetails = new ErrorDetails(
        response.error,
        response.status
      );
      setError(errorDetails);
    }

    setIsLoading(false);
  };

  const socialLoginSubmitHandler = async (event: any) => {
    event?.preventDefault();

    const provider = event.target.value;

    if (!provider) return;

    setIsLoading(true);

    const request = new LoginRequest(enteredUsernameEmail, enteredPassword);

    let callbackUrl = "/agenda";
    await signIn(provider, {
      redirect: false,
      callbackUrl: callbackUrl,
    });

    setIsLoading(false);
  };

  const formIsValid = enteredUsernameEmailIsValid && enteredPasswordIsValid;

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
        <form className={classes.login_form}>
          <div className={classes.actions}>
            <Input
              type={InputType.TEXT}
              label={"E-mail ou Nome de usuário:"}
              id={"username-email"}
              hasError={enteredUsernameEmailInputHasError}
              errorMessage="Nome de usuário ou e-mail deve ser preenchido"
              value={enteredUsernameEmail}
              onChangeHandler={enteredUsernameEmailChangedHandler}
              onBlurHandler={enteredUsernameEmailBlurHandler}
            />
          </div>
          <div className={classes.actions}>
            <Input
              type={InputType.TEXT}
              label={"Senha:"}
              id={"password"}
              hasError={enteredPasswordInputHasError}
              errorMessage={enteredPasswordErrorMessage}
              value={enteredPassword}
              onChangeHandler={enteredPasswordChangedHandler}
              onBlurHandler={enteredPasswordBlurHandler}
            />
          </div>
          <div className={classes.actions_buttons}>
            <div className={classes.actions_button}>
              <Button
                type="button"
                style={ButtonStyle.PRIMARY}
                onClickHandler={(e) => {
                  e.preventDefault();
                  router.push("/criar-conta");
                }}
              >
                Criar Conta
              </Button>
            </div>
            <div className={classes.actions_button}>
              <Button
                type="submit"
                style={ButtonStyle.SUCCESS}
                disabled={!formIsValid}
                onClickHandler={loginSubmitHandler}
              >
                Entrar
              </Button>
            </div>
          </div>
        </form>
        <section className={classes.content_rigth}>
          <form className={classes.content_rigth_form}>
            <p className={classes.content_right_title}>
              Você também pode usar sua rede social favorita:
            </p>

            <button
              type="button"
              value={"facebook"}
              className={classes.content_right_button}
              onClick={socialLoginSubmitHandler}
            >
              Entre usando o Facebook
              <Image
                src={`/images/Facebook.svg`}
                alt="Facebook Logo Image"
                width={77}
                height={77}
              />
            </button>

            <button
              type="button"
              value={"google"}
              className={classes.content_right_button}
              onClick={socialLoginSubmitHandler}
            >
              Entre usando o Google
              <Image
                src={`/images/Google.svg`}
                alt="Google Logo Image"
                width={77}
                height={77}
              />
            </button>

            <button
              type="button"
              value={"facebook"}
              className={classes.content_right_button}
              onClick={socialLoginSubmitHandler}
            >
              Entre usando o Instagram
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

export default Entrar;
