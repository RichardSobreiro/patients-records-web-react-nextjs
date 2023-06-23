/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "@/styles/CriarConta.module.css";

const CriarConta = () => {
  return (
    <div className={classes.content}>
      <section className={classes.content_left}>
        <p>Crie Sua Conta</p>

        <div>
          <Input
            type={InputType.TEXT}
            label={"Nome do seu empreendimento:"}
            id={"company-name"}
            required={true}
            placeholder="Salão da Ana"
          />
        </div>
      </section>
      <section className={classes.content_rigth}></section>
    </div>
  );
};

export default CriarConta;
