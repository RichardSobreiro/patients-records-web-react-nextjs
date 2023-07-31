/** @format */

import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import classes from "@/styles/Home.module.css";
import Button, { ButtonStyle } from "@/components/ui/button";

import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Meu Negocyo</title>
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
              O jeito mais barato e eficiente de gerenciar os seus atendimentos
            </p>
            <small className={classes.small_text}>
              (Ideal para consultórios médicos, odontológicos, salões de beleza,
              clínicas estéticas, manicures, etc.)
            </small>
          </div>
          <div className={classes.top_body_main_image}>
            <Image
              src={`/images/landing_page.png`}
              alt="Meu Negocyo Logo Image"
              width={611}
              height={408}
            />
          </div>
        </div>
        <div className={classes.bottom_body}>
          <p>PLANOS PARA TODOS OS GOSTOS</p>
          <div className={classes.plan_area}>
            <div className={classes.normal_plan}>
              <div>
                <div className={classes.plan_header}>
                  <p>Grátis</p>
                  <p>
                    0 R$<span style={{ fontSize: "15px" }}> / Mês</span>
                  </p>
                </div>
                <div className={classes.plan_body}>
                  <ul>
                    <li>Agenda Online</li>
                    <hr className={classes.solid} />
                    <li>Gestão de Clientes</li>
                    <hr className={classes.solid} />
                    <li>Gestão Financeira</li>
                    <hr className={classes.solid} />
                    <li>Portal Web</li>
                    <hr className={classes.solid} />
                    <li>App Android</li>
                    <hr className={classes.solid} />
                    <li>App iOS</li>
                  </ul>
                </div>
              </div>
              <div className={classes.actions}>
                <Button
                  style={ButtonStyle.PRIMARY}
                  onClickHandler={() => {
                    router.push("/criar-conta");
                  }}
                >
                  Contratar
                </Button>
              </div>
            </div>

            <div className={classes.monthly_plan}>
              <div className={classes.monthly_plan_header}>
                <p>Plano Anual</p>
                <p>
                  19.90 R$<span style={{ fontSize: "15px" }}> / Mês</span>
                </p>
                <p className={classes.monthly_plan_header_benefits}>
                  * Melhor custo benefício
                </p>
                <p className={classes.monthly_plan_header_benefits}>
                  * Cancele a qualquer momento e tenha seu dinheiro de volta
                </p>
              </div>
              <div className={classes.plan_body}>
                <ul>
                  <li>Agenda Online</li>
                  <hr className={classes.solid} />
                  <li>Gestão de Clientes</li>
                  <hr className={classes.solid} />
                  <li>Gestão Financeira</li>
                  <hr className={classes.solid} />
                  <li>Notificações </li>
                  <hr className={classes.solid} />
                  <li>Whatsapp</li>
                  <hr className={classes.solid} />
                  <li>SMSs</li>
                  <hr className={classes.solid} />
                  <li>Gestão Cobranças</li>
                  <hr className={classes.solid} />
                  <li>
                    Armazenamento em Nuvem
                    <br />
                    das Fotos de Clientes
                  </li>
                  <hr className={classes.solid} />
                  <li>Portal Web</li>
                  <hr className={classes.solid} />
                  <li>App Android</li>
                  <hr className={classes.solid} />
                  <li>App iOS</li>
                </ul>
              </div>
              <Button
                style={ButtonStyle.SECONDARY}
                onClickHandler={() => {
                  router.push("/criar-conta");
                }}
              >
                Contratar
              </Button>
            </div>

            <div className={classes.normal_plan}>
              <div>
                <div className={classes.plan_header}>
                  <p>Mensal</p>
                  <p>
                    40 R$<span style={{ fontSize: "15px" }}> / Mês</span>
                  </p>
                </div>
                <div className={classes.plan_body}>
                  <ul>
                    <li>Agenda Online</li>
                    <hr className={classes.solid} />
                    <li>Gestão de Clientes</li>
                    <hr className={classes.solid} />
                    <li>Gestão Financeira</li>
                    <hr className={classes.solid} />
                    <li>Notificações </li>
                    <hr className={classes.solid} />
                    <li>Whatsapp</li>
                    <hr className={classes.solid} />
                    <li>SMSs</li>
                    <hr className={classes.solid} />
                    <li>Gestão Cobranças</li>
                    <hr className={classes.solid} />
                    <li>
                      Armazenamento em Nuvem
                      <br />
                      das Fotos de Clientes
                    </li>
                    <hr className={classes.solid} />
                    <li>Portal Web</li>
                    <hr className={classes.solid} />
                    <li>App Android</li>
                    <hr className={classes.solid} />
                    <li>App iOS</li>
                  </ul>
                </div>
              </div>
              <div className={classes.actions}>
                <Button
                  style={ButtonStyle.PRIMARY}
                  onClickHandler={() => {
                    router.push("/criar-conta");
                  }}
                >
                  Contratar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
