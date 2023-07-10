/** @format */

import classes from "./auth-main-header.module.css";
import Button, { ButtonStyle } from "../ui/button";
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const AuthMainHeader = () => {
  const currentRoute = usePathname();
  const { data: session, status } = useSession();
  const route = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/entrar" });
  };

  return (
    <header className={classes.header}>
      <div className={classes.header_left_container}>
        <Link className={classes.logo} href="/clientes">
          <div className={classes.image}>
            <Image
              src={`/images/icon.png`}
              alt="Meu Negócio Logo Image"
              width={48}
              height={48}
            />
          </div>
          <div className={classes.logo_text}>Meu Negócio</div>
        </Link>
        <nav>
          <ul className={classes.nav_list}>
            <li className={classes.link_container}>
              <Link
                className={
                  currentRoute === "/clientes"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/clientes"
              >
                Clientes
              </Link>
            </li>
            <li className={classes.link_container}>
              <Link
                className={
                  currentRoute === "/agenda"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/agenda"
              >
                Agenda
              </Link>
            </li>
            <li className={classes.link_container}>
              <Link
                className={
                  currentRoute === "/financeiro"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/financeiro"
              >
                Financeiro
              </Link>
            </li>
            <li className={classes.link_container}>
              <Link
                className={
                  currentRoute === "/configuracoes"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/configuracoes"
              >
                Configurações
              </Link>
            </li>
            <li className={classes.link_container}>
              <Link
                className={
                  currentRoute === "/fale-conosco"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/fale-conosco"
              >
                Fale Conosco
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={classes.header_right_container}>
        {status === "authenticated" ? (
          <Button
            type="button"
            onClickHandler={handleSignOut}
            style={ButtonStyle.PRIMARY_BODERED}
          >
            Sair
          </Button>
        ) : (
          <>
            <Link className={classes.signin_button} href="/entrar">
              Entrar
            </Link>
            <Link className={classes.signup_button} href="/criar-conta">
              Criar Conta
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default AuthMainHeader;
