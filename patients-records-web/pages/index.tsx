/** @format */

import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import classes from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Meu Negócio</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={classes.top_body}>
          <div className={classes.top_body_main_text}>
            <p>
              O jeito mais barato e mais eficiente de gerenciar o seu negócio na
              área de beleza
            </p>
          </div>
          <div className={classes.top_body_main_image}>
            <Image
              src={`/images/landing_page.png`}
              alt="Meu Negócio Logo Image"
              width={611}
              height={408}
            />
          </div>
        </div>
        <div className={classes.bottom_body}>
          <p>PLANOS PARA TODOS OS GOSTOS</p>
          <div className={classes.plan_area}>
            <div className={classes.free_plan}></div>
            <div className={classes.monthly_plan}>
              <div className={classes.monthly_plan_header}>
                <p>Plano Anual</p>
                <p>
                  20 R$<span style={{ fontSize: "15px" }}> / Mês</span>
                </p>
                <p className={classes.monthly_plan_header_benefits}>
                  * Melhor Custo Benefício
                </p>
                <p className={classes.monthly_plan_header_benefits}>
                  * Cancelamento a qualquer hora
                </p>
                <div className={classes.plan_body}>
                  <ul>
                    <li>Agenda Online</li>
                    <li>Gestão de Clientes</li>
                    <li>Gestão Financeira</li>
                    <li>Notificações</li>
                    <li>Whatsapp</li>
                    <li>SMSs</li>
                    <li>Gestão Cobranças</li>
                    <li>Armazenamento em Nuvem Fotos de Clientes</li>
                    <li>Portal Web</li>
                    <li>App Android</li>
                    <li>App iOS</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={classes.anual_plan}></div>
          </div>
        </div>
      </main>
    </>
  );
}
