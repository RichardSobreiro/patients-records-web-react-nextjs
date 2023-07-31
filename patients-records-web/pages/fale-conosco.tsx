/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import Input, { InputType } from "@/components/ui/input";
import NotificationBottom from "@/components/ui/notification";
import TextArea from "@/components/ui/textarea";
import useInput from "@/hooks/use-input";
import { NotificationContext } from "@/store/notification-context";
import classes from "@/styles/FaleConosco.module.css";
import { isEmail, isNotEmpty } from "@/util/field-validations";
import Head from "next/head";

import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const sendContactData = async (
  name: string,
  email: string,
  message: string
) => {
  const response = await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
};

const FaleConosco = () => {
  const notificationCtx = useContext(NotificationContext);

  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: enteredNameInputHasError,
    valueChangeHandler: enteredNameChangedHandler,
    inputBlurHandler: enteredNameBlurHandler,
    reset: resetEnteredNameInput,
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
    value: enteredMessage,
    isValid: enteredMessageIsValid,
    hasError: enteredMessageInputHasError,
    valueChangeHandler: enteredMessageChangedHandler,
    inputBlurHandler: enteredMessageBlurHandler,
    reset: resetEnteredMessageInput,
  } = useInput({ validateValue: isNotEmpty });

  const sendMessageHandler = async (event: any) => {
    event.preventDefault();

    if (
      !enteredMessageIsValid ||
      !enteredEmailIsValid ||
      !enteredMessageIsValid
    )
      return;

    //setRequestStatus("pending");
    setIsSendingMessage(true);
    notificationCtx.showNotification({
      status: "pending",
      title: "Enviando...",
      message: "Sua mensagem está sendo enviada!",
    });

    try {
      await sendContactData(enteredName!, enteredEmail!, enteredMessage!);
      //setRequestStatus("success");
      notificationCtx.showNotification({
        status: "success",
        title: "Sucesso!",
        message: "Iremos enviar uma resposta a sua mensagem em até 24 horas!",
      });
      resetEnteredMessageInput();
      resetEmailInput();
      resetEnteredNameInput();
    } catch (error: any) {
      //setRequestStatus("error");
      notificationCtx.showNotification({
        status: "error",
        title: "Erro!",
        message: "Ocorreu um erro ao enviar sua mensagem. Tente novamente!",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formIsValid =
    enteredNameIsValid && enteredEmailIsValid && enteredMessageIsValid;

  return (
    <>
      <Head>
        <title>Fale Conosco</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={classes.content}>
        <div className={classes.content_left}>
          <form id="newsletter-form" onSubmit={sendMessageHandler}>
            <p className={classes.title}>
              Envie-nos uma mensagem sobre qualquer assunto através do
              formulário abaixo:
            </p>

            <div>
              <Input
                type={InputType.TEXT}
                id={"name"}
                label={"Nome:"}
                hasError={enteredNameInputHasError}
                errorMessage="O deve ser preenchido"
                placeholder={"Ex.: Ana Maria"}
                value={enteredName}
                onChangeHandler={enteredNameChangedHandler}
                onBlurHandler={enteredNameBlurHandler}
              />
            </div>

            <div>
              <Input
                type={InputType.TEXT}
                id={"email"}
                label={"E-mail:"}
                hasError={emailInputHasError}
                errorMessage="O e-mail é inválido"
                placeholder={"Ex.: anamaria@email.com"}
                value={enteredEmail}
                onChangeHandler={emailChangedHandler}
                onBlurHandler={emailBlurHandler}
              />
            </div>

            <div>
              <TextArea
                label={"Mensagem"}
                id={"message"}
                hasError={enteredMessageInputHasError}
                errorMessage="A mensagem é obrigatóra."
                rows={5}
                required={true}
                placeholder={"Digite sua mensagem aqui..."}
                value={enteredMessage}
                onChangeHandler={enteredMessageChangedHandler}
                onBlurHandler={enteredMessageBlurHandler}
              />
            </div>

            <div className={classes.actions}>
              <Button
                type="submit"
                style={ButtonStyle.PRIMARY_BODERED}
                disabled={!formIsValid || isSendingMessage}
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>

        <div className={classes.content_right}>
          <Image
            src={`/images/girl_calling.svg`}
            alt="Garota fazendo uma ligação com celular"
            width={600}
            height={416}
          />
        </div>
      </section>
    </>
  );
};

export default FaleConosco;
