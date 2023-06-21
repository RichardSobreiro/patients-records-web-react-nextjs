/** @format */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import classes from "./main-header.module.css";

const MainHeader = () => {
  const currentRoute = usePathname();

  return (
    <header className={classes.header}>
      <div className={classes.header_left_container}>
        <Link className={classes.logo} href="/">
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
                  currentRoute === "/"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/"
              >
                Início
              </Link>
            </li>
            <li className={classes.link_container}>
              <Link
                className={
                  currentRoute === "/planos"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/planos"
              >
                Planos
              </Link>
            </li>
            <li className={classes.link_container}>
              <Link
                className={
                  currentRoute === "/sobre"
                    ? classes.link_text_active
                    : classes.link_text
                }
                href="/sobre"
              >
                Sobre
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
        <Link className={classes.signin_button} href="/entrar">
          Entrar
        </Link>
        <Link className={classes.signup_button} href="/criar-conta">
          Criar Conta
        </Link>
      </div>
    </header>
  );
};

export default MainHeader;
