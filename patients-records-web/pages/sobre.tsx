/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import classes from "@/styles/Sobre.module.css";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Sobre = () => {
  const router = useRouter();

  return (
    <div className={classes.content}>
      <section className={classes.presentation_container}>
        <div className={classes.presentation_container_left}>
          <p className={classes.presentation_title}>
            O portal{" "}
            <span className={classes.meu_negocio_text}>Meu Negocyo</span> se
            ajusta a sua necessidade e com o{" "}
            <span className={classes.meu_negocio_text}>
              melhor preço e qualidade entre todas as plataformas concorrentes
            </span>
          </p>

          <p className={classes.about_page_text}>
            Ideal para empreendimentos na área de beleza como cabelereiros,
            esmalterias, barbearias, clínicas de estética facial, corporal, e
            muito mais.
          </p>

          <Button
            style={ButtonStyle.PRIMARY_BODERED}
            onClickHandler={() => {
              router.push("/criar-conta");
            }}
          >
            Crie Sua Conta
          </Button>
        </div>

        <div className={classes.presentation_image}>
          <Image
            src={`/images/beauty_saloon_about_page.svg`}
            alt="Image de um salão de beleza"
            width={600}
            height={416}
          />
        </div>
      </section>
      <section className={classes.features_container}>
        <article className={classes.feature_article}>
          <p className={classes.feature_title}>
            Notificações para seus Clientes
          </p>
          <p className={classes.feature_text}>
            Sabe quando seu cliente liga e diz que esqueceu do horário agendado
            com você? Pois é, com o portal{" "}
            <span className={classes.meu_negocio_text}>Meu Negocyo</span> você
            pode customizar notificações via Whatsapp ou SMS para ajudar seus
            clientes a planejar melhor os compromissos com a sua empresa.
          </p>
        </article>
        <article className={classes.feature_article}>
          <p className={classes.feature_title}>Armazenamento de Fotos</p>
          <p className={classes.feature_text}>
            Com o portal{" "}
            <span className={classes.meu_negocio_text}>Meu Negocyo</span> você
            nunca mais vai sentir aquela sensação de desorganização em relação a
            fotos do antes e depois de seus clientes. Nós armazenamos esse item
            extremamente importante para você com total segurança e praticidade.
          </p>
        </article>
        <article className={classes.feature_article}>
          <p className={classes.feature_title}>
            Gestão da carteira de Clientes
          </p>
          <p className={classes.feature_text}>
            Crie clientes e faça a gestão de questões como procedimentos,
            pendências financeiras, fotos do antes e depois, anamneses, agenda,
            mensagens, etc. Com o portal{" "}
            <span className={classes.meu_negocio_text}>Meu Negocyo</span> sua
            vida fica muito mais simples.
          </p>
        </article>

        <article className={classes.feature_article}>
          <p className={classes.feature_title}>Agenda Inteligente</p>
          <p className={classes.feature_text}>
            O portal{" "}
            <span className={classes.meu_negocio_text}>Meu Negocyo</span> sabe
            como é difícil gerencia um empreendimento na área de beleza e com
            uma agenda online que ajuda você e seus clientes a lembrar de tudo
            através de notificações inteligentes e customizadas por você esse
            trabalho fica muito mais fácil.
          </p>
        </article>
        <article className={classes.feature_article}>
          <p className={classes.feature_title}>Gestão Financeira</p>
          <p className={classes.feature_text}>
            Com a solução do portal{" "}
            <span className={classes.meu_negocio_text}>Meu Negocyo</span> você
            tem relatórios financeiros detalhados onde você consegue saber
            quanto, onde e como cada cliente gastou no seus serviços e produtos.
          </p>
        </article>
        <article className={classes.feature_article}>
          <p className={classes.feature_title}>Gestão de Colaboradores</p>
          <p className={classes.feature_text}>
            Crie a sua conta e tenha uma ferramenta poderosa que irá te ajudar a
            saber o valor de comissões a serem pagas a seus colaboradores,
            pendências, histórico de atendimentos, etc. Tudo isso em uma
            plataforma web e mobile estremamente rápida oferecida pelo portal{" "}
            <span className={classes.meu_negocio_text}>Meu Negocyo</span>.
          </p>
        </article>
      </section>
      <section className={classes.go_to_purchase_area}>
        <Button
          style={ButtonStyle.PRIMARY_BODERED}
          onClickHandler={() => {
            router.push("/criar-conta");
          }}
        >
          Está esperando o quê? Click aqui e crie sua conta agora!
        </Button>
      </section>
    </div>
  );
};

export default Sobre;
