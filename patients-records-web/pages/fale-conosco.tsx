/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import Input, { InputType } from "@/components/ui/input";
import NotificationBottom from "@/components/ui/notification";
import TextArea from "@/components/ui/textarea";
import classes from "@/styles/FaleConosco.module.css";

import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [enteredName, setEnteredName] = useState<string>();
  const [enteredEmail, setEnteredEmail] = useState<string>();
  const [enteredMessage, setEnteredMessage] = useState<string>();
  const [requestStatus, setRequestStatus] = useState<string | null>(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState<string | null>();

  useEffect(() => {
    if (requestStatus === "success" || requestStatus === "error") {
      const timer = setTimeout(() => {
        setRequestStatus(null);
        setRequestError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  const sendMessageHandler = async (event: any) => {
    event.preventDefault();

    setRequestStatus("pending");

    try {
      await sendContactData(enteredName!, enteredEmail!, enteredMessage!);
      setRequestStatus("success");
      setEnteredMessage("");
      setEnteredEmail("");
      setEnteredName("");
    } catch (error: any) {
      setRequestError(error.message);
      setRequestStatus("error");
    }
  };

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Enviando...",
      message: "Sua mensagem está sendo enviada!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Sucesso!",
      message: "Iremos enviar uma resposta a sua mensagem em até 24 horas!",
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Erro!",
      message: requestError,
    };
  }

  return (
    <>
      <section className={classes.content}>
        <div className={classes.content_left}>
          <form onSubmit={sendMessageHandler}>
            <p className={classes.title}>
              Envie-nos uma mensagem sobre qualquer assunto através do
              formulário abaixo:
            </p>

            <div>
              <Input
                type={InputType.TEXT}
                id={"name"}
                label={"Nome:"}
                required={true}
                placeholder={"Ex.: Ana Maria"}
                value={enteredName}
                onChangeHandler={setEnteredName}
              />
            </div>

            <div>
              <Input
                type={InputType.TEXT}
                id={"email"}
                label={"E-mail:"}
                required={true}
                placeholder={"Ex.: anamaria@email.com"}
                value={enteredEmail}
                onChangeHandler={setEnteredEmail}
              />
            </div>

            <div>
              <TextArea
                label={"Mensagem"}
                id={"message"}
                rows={5}
                required={true}
                placeholder={"Digite sua mensagem aqui..."}
                value={enteredMessage}
                onChangeHandler={setEnteredMessage}
              />
            </div>

            <div className={classes.actions}>
              <Button type="submit" style={ButtonStyle.PRIMARY_BODERED}>
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
      {notification && (
        <NotificationBottom
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
    </>
  );
};

export default FaleConosco;
