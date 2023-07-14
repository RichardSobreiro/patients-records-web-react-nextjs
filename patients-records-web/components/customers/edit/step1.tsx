/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./step1.module.css";

type Props = {
  enteredCustomerName: string;
  customerNameInputHasError: boolean;
  customerNameChangedHandler: (event: any) => void;
  customerNameBlurHandler: (event: any) => void;
  enteredCustomerPhoneNumber: string;
  customerPhoneNumberInputHasError: boolean;
  customerPhoneNumberChangedHandler: (event: any) => void;
  customerPhoneNumberBlurHandler: (event: any) => void;
  enteredCustomerEmail: string;
  customerEmailInputHasError: boolean;
  customerEmailChangedHandler: (event: any) => void;
  customerEmailBlurHandler: (event: any) => void;
  enteredCustomerBirthdate: string;
  customerBirthdateInputHasError: boolean;
  customerBirthdateChangedHandler: (event: any) => void;
  customerBirthdateBlurHandler: (event: any) => void;
};

const Step1 = (props: Props) => {
  return (
    <section className={classes.container}>
      <h1 className={classes.title}>Identificação e Contatos</h1>
      <div className={classes.action_group}>
        <Input
          type={InputType.TEXT}
          label={"Nome"}
          id={"customer-name"}
          hasError={props.customerNameInputHasError}
          errorMessage={"O nome do cliente é inválido"}
          value={props.enteredCustomerName}
          onChangeHandler={props.customerNameChangedHandler}
          onBlurHandler={props.customerNameBlurHandler}
        />
      </div>
      <div className={classes.action_group}>
        <Input
          type={InputType.TEXT}
          label={"Telefone"}
          id={"customer-phone-number"}
          hasError={props.customerPhoneNumberInputHasError}
          errorMessage={"O telefone do cliente é inválido"}
          value={props.enteredCustomerPhoneNumber}
          onChangeHandler={props.customerPhoneNumberChangedHandler}
          onBlurHandler={props.customerPhoneNumberBlurHandler}
        />
      </div>
      <div className={classes.action_group}>
        <Input
          type={InputType.EMAIL}
          label={"E-mail (opcional)"}
          id={"customer-email"}
          hasError={props.customerEmailInputHasError}
          errorMessage={"O e-mail do cliente é inválido"}
          value={props.enteredCustomerEmail}
          onChangeHandler={props.customerEmailChangedHandler}
          onBlurHandler={props.customerEmailBlurHandler}
        />
      </div>
    </section>
  );
};

export default Step1;
