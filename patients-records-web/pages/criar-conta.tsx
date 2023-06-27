/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import Input, { InputType } from "@/components/ui/input";
import classes from "@/styles/CriarConta.module.css";

import Image from "next/image";

const CriarConta = () => {
  const onSubmitHandler = async () => {};

  const socialLoginSubmitHandler = async () => {};

  return (
    <div className={classes.content}>
      <section className={classes.content_left}>
        <form className={classes.content_left_form} onSubmit={onSubmitHandler}>
          <p className={classes.content_left_title}>Crie Sua Conta</p>

          <div className={classes.actions}>
            <Input
              type={InputType.TEXT}
              label={"Nome do seu empreendimento:"}
              id={"company-name"}
              required={true}
              placeholder="Ex.: Salão da Ana"
            />
          </div>
          <div className={classes.actions}>
            <Input
              type={InputType.EMAIL}
              label={"E-mail:"}
              id={"email"}
              required={true}
              placeholder="Ex.: anamaria@meunegocio.com"
            />
          </div>
          <div className={classes.actions}>
            <Input
              type={InputType.TEXT}
              label={"Nome de usuário:"}
              id={"username"}
              required={true}
              placeholder="Ex.: Ana Maria"
            />
          </div>
          <div className={classes.actions}>
            <Input
              type={InputType.TEXT}
              label={"Senha:"}
              id={"password"}
              required={true}
              placeholder="Ex.: 02091945@MeuNegocio"
            />
          </div>
          <div className={classes.actions}>
            <Input
              type={InputType.TEXT}
              label={"Confirme sua Senha:"}
              id={"password-confirmation"}
              required={true}
              placeholder="Ex.: 02091945@MeuNegocio"
            />
          </div>
          <div className={classes.actions_button}>
            <Button style={ButtonStyle.SUCCESS}>Criar</Button>
          </div>
        </form>
      </section>
      <section className={classes.content_rigth}>
        <form
          className={classes.content_rigth_form}
          onSubmit={socialLoginSubmitHandler}
        >
          <p className={classes.content_right_title}>
            Você também pode usar sua rede social favorita:
          </p>

          <button className={classes.content_right_button}>
            Crie sua conta usando o Facebook
            <Image
              src={`/images/Facebook.svg`}
              alt="Facebook Logo Image"
              width={77}
              height={77}
            />
          </button>

          <button className={classes.content_right_button}>
            Crie sua conta usando o Google
            <Image
              src={`/images/Google.svg`}
              alt="Google Logo Image"
              width={77}
              height={77}
            />
          </button>

          <button className={classes.content_right_button}>
            Crie sua conta usando o Instagram
            <Image
              src={`/images/Instagram.svg`}
              alt="Instagram Logo Image"
              width={77}
              height={77}
            />
          </button>
        </form>
      </section>
    </div>
  );
};

export default CriarConta;
