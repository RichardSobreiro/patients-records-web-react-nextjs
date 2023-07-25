/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./create-anamnesis.module.css";
import Dropdown, { Item } from "@/components/ui/dropdown";
import { anamnesisTypesList } from "@/util/constants/lists";
import PersonalInfo from "../edit/personal-info";

import { useRouter } from "next/router";
import useInput from "@/hooks/use-input";
import { isNotEmpty } from "@/util/field-validations";
import { useContext, useEffect, useState } from "react";
import useDropdown from "@/hooks/use-dropdown";
import AnamnesisFreeTypeForm from "./types/free-type";
import Button, { ButtonStyle } from "@/components/ui/button";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";
import { CreateAnamnesisRequest } from "@/models/customers/CreateAnamnesisRequest";
import { createAnamnesis } from "@/api/customers/anamnesisApi";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { formatDateTime } from "@/util/date-helpers";

const CreateAnamnesis = () => {
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
    value: anamnesisFreeTypeText,
    isValid: anamnesisFreeTypeTextIsValid,
    hasError: anamnesisFreeTypeTextInputHasError,
    valueChangeHandler: anamnesisFreeTypeTextChangedHandler,
    inputBlurHandler: anamnesisFreeTypeTextBlurHandler,
    reset: resetAnamnesisFreeTypeTextInput,
  } = useInput({ validateValue: isNotEmpty });

  useEffect(() => {
    let today = new Date();
    setDate(formatDateTime(today));
    const defaultType = anamnesisTypesList.find((at) => at.id == 1);
    setType(defaultType as unknown as Item);
  }, []);

  const handleSubmit = async () => {
    if (!enteredDateIsValid || !typeIsValid || !anamnesisFreeTypeTextIsValid) {
      dateBlurHandler(undefined);
      typeBlurHandler();
      anamnesisFreeTypeTextBlurHandler(undefined);
      return;
    }

    setIsLoading(true);

    const dateObject = new Date(enteredDate);

    const createAnamnesisRequest = new CreateAnamnesisRequest(
      router.query.customerId as string,
      dateObject,
      [(type as Item)?.description!],
      anamnesisFreeTypeText
    );

    const apiResponse = await createAnamnesis(
      userCustom.accessToken,
      createAnamnesisRequest
    );

    if (apiResponse.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "Sua anamnese foi criada com sucesso!",
      };
      notificationCtx.showNotification(notification);
      router.replace(
        `/clientes/editar/${apiResponse.body.customerId}/anamneses/${apiResponse.body.anamneseId}/editar`
      );
    } else {
      const notification = {
        status: "error",
        title: "Opsss...",
        message:
          "Tivemos um problema passageiro. Aguarde alguns segundos e tente novamente!",
      };
      notificationCtx.showNotification(notification);
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <PersonalInfo customerId={`${router.query.customerId}`} />

      <section className={classes.title_container}>
        <p className={classes.title}>Nova Anamnese</p>
      </section>
      <section className={classes.header_container}>
        <div className={classes.header_container_left}>
          <div>
            <Input
              type={InputType.DATE_TIME}
              label={"Data"}
              id={"anamnesis-date-create"}
              hasError={dateInputHasError}
              errorMessage={"A data da anamnese é inválida"}
              value={enteredDate}
              onChangeHandler={dateChangedHandler}
              onBlurHandler={dateBlurHandler}
            />
          </div>
          <div>
            <Dropdown
              label={"Tipo"}
              list={anamnesisTypesList}
              id={"anamnesis-type-create"}
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
      <section className={classes.anaminesis_body}>
        {(type as Item)?.id == "1" && (
          <AnamnesisFreeTypeForm
            anamnesisFreeTypeText={anamnesisFreeTypeText}
            anamnesisFreeTypeTextInputHasError={
              anamnesisFreeTypeTextInputHasError
            }
            anamnesisFreeTypeTextChangedHandler={
              anamnesisFreeTypeTextChangedHandler
            }
            anamnesisFreeTypeTextBlurHandler={anamnesisFreeTypeTextBlurHandler}
          />
        )}
      </section>
    </>
  );
};

export default CreateAnamnesis;
