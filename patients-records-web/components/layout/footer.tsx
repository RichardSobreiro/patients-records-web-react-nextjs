/** @format */

import classes from "./footer.module.css";

import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";

const Footer = () => {
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
              Envie-nos uma mensagem sobresobre qualquer assunto usando o email{" "}
              <span
                className={classes.footer_main_area_container_body_contact_text}
              >
                contato@meunegocio.com
              </span>{" "}
              ou vá direto para nossa página Fale Conosco.
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
          <div className={classes.footer_main_area_container_body}>
            <p
              className={classes.footer_main_area_text}
              style={{ width: "320px" }}
            >
              Cadestre-se em nossa rede e receba notícias sobre empreendedorismo
              na área de beleza:
            </p>
            <input
              className={classes.feed_input_email}
              type="email"
              placeholder="Digite seu e-mail aqui..."
            />
            <button className={classes.feed_input_button}>Cadastrar</button>
          </div>
        </div>
      </div>
      <div className={classes.footer_copyright}>
        <div className={classes.copyright}>
          <Link className={classes.logo} href="/">
            <div className={classes.image}>
              <Image
                src={`/images/icon.png`}
                alt="Meu Negócio Logo Image"
                width={48}
                height={48}
              />
            </div>
            <div className={classes.copyright_text}>Meu Negócio</div>
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
    </footer>
  );
};

export default Footer;
