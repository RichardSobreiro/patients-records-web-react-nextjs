/** @format */

import Input, { InputType } from "@/components/ui/input";
import TextArea from "@/components/ui/textarea";
import classes from "@/styles/FaleConosco.module.css";

import Image from "next/image";

const FaleConosco = () => {
  return (
    <section className={classes.content}>
      <div className={classes.content_left}>
        <p className={classes.title}>
          Envie-nos uma mensagem sobre qualquer assunto através do formulário
          abaixo:
        </p>

        <div>
          <Input
            type={InputType.TEXT}
            id={"name"}
            label={"Nome:"}
            required={true}
            placeholder={"Ex.: Ana Maria"}
          />
        </div>

        <div>
          <Input
            type={InputType.TEXT}
            id={"email"}
            label={"E-mail:"}
            required={true}
            placeholder={"Ex.: anamaria@email.com"}
          />
        </div>

        <div>
          <TextArea
            label={"Mensagem"}
            id={"message"}
            rows={5}
            required={true}
            placeholder={"Digite sua mensagem aqui..."}
          />
        </div>
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
  );
};

export default FaleConosco;
