/** @format */

import classes from "./footer.module.css";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import NotificationBottom from "../ui/notification";

const sendContactData = async (email: string) => {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ocorreu um erro. Tente novamente, por favor!"
    );
  }
};

const Footer = () => {
  const [enteredEmail, setEnteredEmail] = useState<string>("");
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
      await sendContactData(enteredEmail!);
      setRequestStatus("success");
      setEnteredEmail("");
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
      message: "Sua subscrição está sendo realizada!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Sucesso!",
      message:
        "Você faz parte da maior rede de empreendedores na área de beleza do Brasil!",
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
    <footer className={classes.footer}>
      <div className={classes.footer_main_area}>
        <div className={classes.footer_main_area_container}>
          <p className={classes.footer_main_area_title}>NAVEGAÇÃO</p>
          <div className={classes.footer_main_area_container_body}>
            <Link className={classes.footer_main_area_text} href="/">
              Início
            </Link>
            <Link className={classes.footer_main_area_text} href="/planos">
              Planos
            </Link>
            <Link className={classes.footer_main_area_text} href="/sobre">
              Sobre
            </Link>
            <Link
              className={classes.footer_main_area_text}
              href="/fale-conosco"
            >
              Fale Conosco
            </Link>
            <Link className={classes.footer_main_area_text} href="/criar-conta">
              Criar Conta
            </Link>
            <Link className={classes.footer_main_area_text} href="/criar-conta">
              Entrar
            </Link>
          </div>
        </div>
        <div className={classes.footer_main_area_container}>
          <p className={classes.footer_main_area_title}>FALE CONOSCO</p>
          <div className={classes.footer_main_area_container_body}>
            <p
              className={classes.footer_main_area_text}
              style={{ width: "320px" }}
            >
              Envie-nos uma mensagem sobre qualquer assunto usando o e-mail{" "}
              <span
                className={classes.footer_main_area_container_body_contact_text}
              >
                contato@meunegocio.com
              </span>{" "}
              ou vá direto para nossa página{" "}
              {/* <span
                className={classes.footer_main_area_container_body_contact_text}
              >
                Fale Conosco
              </span> */}
              <Link
                className={classes.footer_main_area_container_body_contact_text}
                href="/fale-conosco"
              >
                Fale Conosco
              </Link>
              .
            </p>
            <div className={classes.social_icons_container}>
              <SocialIcon
                network={"whatsapp"}
                title={"whatsapp"}
                bgColor={"#2540a0"}
                url="https://google.com"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                network={"instagram"}
                title={"instagram"}
                bgColor={"#2540a0"}
                url="https://google.com"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                network={"facebook"}
                title={"facebook"}
                bgColor={"#2540a0"}
                url="https://google.com"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                network={"linkedin"}
                title={"linkedin"}
                bgColor={"#2540a0"}
                url="https://google.com"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                network={"youtube"}
                title={"youtube"}
                bgColor={"#2540a0"}
                url="https://google.com"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                network={"twitter"}
                title={"twitter"}
                bgColor={"#2540a0"}
                url="https://google.com"
                style={{ height: 40, width: 40 }}
              />
            </div>
          </div>
        </div>
        <div className={classes.footer_main_area_container}>
          <p className={classes.footer_main_area_title}>FEED DE NOTÍCIAS</p>
          <form
            id="newsletter-form"
            onSubmit={sendMessageHandler}
            className={classes.footer_main_area_container_body}
          >
            <p
              className={classes.footer_main_area_text}
              style={{ width: "320px" }}
            >
              Cadastre-se em nossa rede e receba notícias sobre casos de sucesso
              e dicas de especialistas sobre empreendedorismo na área de beleza:
            </p>
            <input
              className={classes.feed_input_email}
              type="email"
              placeholder="Digite seu e-mail aqui..."
              value={enteredEmail}
              onChange={(event) => setEnteredEmail(event.target.value)}
            />
            <button type="submit" className={classes.feed_input_button}>
              Cadastrar
            </button>
          </form>
        </div>
      </div>
      <div className={classes.footer_copyright}>
        <div className={classes.copyright}>
          <Link className={classes.logo} href="/">
            <div className={classes.image}>
              <Image
                src={`/images/icon.png`}
                alt="Meu Negocyo Logo Image"
                width={48}
                height={48}
              />
            </div>
            <div className={classes.copyright_text}>Meu Negocyo</div>
          </Link>
          <div>
            <p className={classes.allrights}>
              @ {new Date().getFullYear()} Sobreiro Technologies LTDA
            </p>
          </div>
        </div>
        {/* <div className={classes.copyright_left}>
          <div>
            <p className={classes.allrights}>Política de Privacidade</p>
            <p className={classes.allrights}>Termos</p>
          </div>
        </div> */}
      </div>
      {notification && (
        <NotificationBottom
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
    </footer>
  );
};

export default Footer;
