/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import Input, { InputType } from "@/components/ui/input";
import classes from "@/styles/Entrar.module.css";

import { useRouter } from "next/router";
import Image from "next/image";

const Entrar = () => {
  const router = useRouter();

  const socialLoginSubmitHandler = () => {};

  return (
    <div className={classes.content}>
      <form className={classes.login_form}>
        <div className={classes.actions}>
          <Input
            type={InputType.TEXT}
            label={"E-mail ou Nome de usuário:"}
            id={"username-email"}
            required={true}
          />
        </div>
        <div className={classes.actions}>
          <Input
            type={InputType.TEXT}
            label={"Senha:"}
            id={"password"}
            required={true}
          />
        </div>
        <div className={classes.actions_buttons}>
          <div className={classes.actions_button}>
            <Button
              style={ButtonStyle.PRIMARY_BODERED}
              onClickHandler={(e) => {
                e.preventDefault();
                router.push("/criar-conta");
              }}
            >
              Criar Conta
            </Button>
          </div>
          <div className={classes.actions_button}>
            <Button style={ButtonStyle.SUCCESS}>Entrar</Button>
          </div>
        </div>
      </form>
      <section className={classes.content_rigth}>
        <form
          className={classes.content_rigth_form}
          onSubmit={socialLoginSubmitHandler}
        >
          <p className={classes.content_right_title}>
            Você também pode usar sua rede social favorita:
          </p>

          <button className={classes.content_right_button}>
            Entre usando o Facebook
            <Image
              src={`/images/Facebook.svg`}
              alt="Facebook Logo Image"
              width={77}
              height={77}
            />
          </button>

          <button className={classes.content_right_button}>
            Entre usando o Google
            <Image
              src={`/images/Google.svg`}
              alt="Google Logo Image"
              width={77}
              height={77}
            />
          </button>

          <button className={classes.content_right_button}>
            Entre usando o Instagram
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

export default Entrar;
