/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./step3.module.css";

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
  enteredBirthdate: string;
  birthdateInputHasError: boolean;
  birthdateChangedHandler: (event: any) => void;
  birthdateBlurHandler: (event: any) => void;
};

const Step3 = (props: Props) => {
  return (
    <>
      <section className={classes.container}>
        <h1 className={classes.title}>Resumo e Salvar</h1>

        <div className={classes.action_group}>
          <div>
            <Input
              type={InputType.TEXT}
              label={"Nome"}
              id={"customer-name"}
              hasError={props.customerNameInputHasError}
              errorMessage={"O nome do cliente é inválido"}
              value={props.enteredCustomerName}
              onChangeHandler={props.customerNameChangedHandler}
              onBlurHandler={props.customerNameBlurHandler}
              readOnly={true}
            />
          </div>
          <div>
            <Input
              type={InputType.TEXT}
              label={"Telefone"}
              id={"customer-phone-number"}
              hasError={props.customerPhoneNumberInputHasError}
              errorMessage={"O telefone do cliente é inválido"}
              value={props.enteredCustomerPhoneNumber}
              onChangeHandler={props.customerPhoneNumberChangedHandler}
              onBlurHandler={props.customerPhoneNumberBlurHandler}
              readOnly={true}
            />
          </div>
          <div>
            <Input
              type={InputType.EMAIL}
              label={"E-mail (opcional)"}
              id={"customer-email"}
              hasError={props.customerEmailInputHasError}
              errorMessage={"O e-mail do cliente é inválido"}
              value={props.enteredCustomerEmail}
              onChangeHandler={props.customerEmailChangedHandler}
              onBlurHandler={props.customerEmailBlurHandler}
              readOnly={true}
            />
          </div>
          <div>
            <Input
              type={InputType.DATE}
              label={"Data de Aniversário"}
              id={"customer-birthdate"}
              hasError={props.birthdateInputHasError}
              errorMessage={"A data de aniversário do cliente é inválida"}
              value={props.enteredBirthdate}
              onChangeHandler={props.birthdateChangedHandler}
              onBlurHandler={props.birthdateBlurHandler}
              readOnly={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Step3;
