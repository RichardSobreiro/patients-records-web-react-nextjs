/** @format */

import LoadingSpinner from "@/components/ui/loading-spinner";
import PersonalInfo from "../edit/personal-info";
import { NotificationContext } from "@/store/notification-context";
import classes from "./create-service.module.css";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import Input, { InputType } from "@/components/ui/input";
import { isNotEmpty } from "@/util/field-validations";
import useInput from "@/hooks/use-input";
import Dropdown from "@/components/ui/dropdown";
import { anamnesisTypesList } from "@/util/constants/lists";
import useDropdown from "@/hooks/use-dropdown";
import Button, { ButtonStyle } from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";

const CreateService = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

  const {
    value: enteredDate,
    isValid: enteredDateIsValid,
    hasError: dateInputHasError,
    valueChangeHandler: dateChangedHandler,
    inputBlurHandler: dateBlurHandler,
    reset: resetDateInput,
    setEnteredValue: setDate,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: type,
    isValid: typeIsValid,
    hasError: typeInputHasError,
    valueChangeHandler: typeChangeHandler,
    inputBlurHandler: typeBlurHandler,
    reset: resetType,
    errorMessage: typeErrorMessage,
    setItem: setType,
  } = useDropdown({ validateValue: () => true });

  const {
    value: beforeComments,
    isValid: beforeCommentsIsValid,
    hasError: beforeCommentsInputHasError,
    valueChangeHandler: beforeCommentsChangedHandler,
    inputBlurHandler: beforeCommentsBlurHandler,
    reset: resetBeforeCommentsInput,
    setEnteredValue: setBeforeComments,
  } = useInput({ validateValue: () => true });

  useEffect(() => {
    let today = new Date();
    setDate(today.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = async () => {};

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <PersonalInfo customerId={`${router.query.customerId}`} />

      <section className={classes.title_container}>
        <p className={classes.title}>Novo Atendimento</p>
      </section>

      <section className={classes.header_container}>
        <div className={classes.header_container_left}>
          <div>
            <Input
              type={InputType.DATE}
              label={"Data do Atendimento:"}
              id={"service-date-create"}
              hasError={dateInputHasError}
              errorMessage={"A data do atendimento é inválida"}
              value={enteredDate}
              onChangeHandler={dateChangedHandler}
              onBlurHandler={dateBlurHandler}
            />
          </div>
          <div>
            <Dropdown
              label={"Tipo:"}
              list={anamnesisTypesList}
              id={"service-type-create"}
              idPropertyName={"id"}
              descriptionPropertyName={"description"}
              value={type}
              onBlurHandler={typeBlurHandler}
              onChangeHandler={typeChangeHandler}
              hasError={typeInputHasError}
              errorMessage="O tipo da anamnese deve ser selecionado"
            />
          </div>
        </div>
        <div className={classes.header_container_right}>
          <Button style={ButtonStyle.SUCCESS} onClickHandler={handleSubmit}>
            Criar
          </Button>
          <Button
            style={ButtonStyle.NEUTRAL}
            onClickHandler={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </section>

      <section className={classes.before_container}>
        <p className={classes.step_title}>
          Informações de Antes do Atendimento:
        </p>
        <div className={classes.before_comments_container}>
          <TextArea
            label={"Observações de Antes do Atendimento:"}
            id={"before-comments-create-service"}
            hasError={beforeCommentsInputHasError}
            errorMessage={
              "Os comentários de antes do atendimento são inválidos"
            }
            rows={5}
            required={false}
            value={beforeComments}
            onChangeHandler={beforeCommentsChangedHandler}
            onBlurHandler={beforeCommentsBlurHandler}
          />
        </div>
        <div className={classes.photos_container}>
          <p className={classes.photos_container_title}>Fotos do Antes:</p>

          <InputFile />
        </div>
      </section>
    </>
  );
};

export default CreateService;
