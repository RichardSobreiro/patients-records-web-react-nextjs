/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./create-anamnesis.module.css";
import PersonalInfo from "../edit/personal-info";

import { useRouter } from "next/router";
import useInput from "@/hooks/use-input";
import { atLeastOneSelectedArray, isNotEmpty } from "@/util/field-validations";
import { useContext, useEffect, useState } from "react";
import useDropdown from "@/hooks/use-dropdown";
import AnamnesisFreeTypeForm from "./types/free-type";
import Button, { ButtonStyle } from "@/components/ui/button";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";
import {
  CreateAnamnesisRequest,
  CreateAnamnesisTypeContentRequest,
} from "@/models/customers/CreateAnamnesisRequest";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { formatDateTime } from "@/util/date-helpers";
import DropdownAnamnesisTypes, {
  ItemAnamnesis,
} from "@/components/ui/dropdown-anamnesis-type";
import { createAnamnesis } from "@/api/customers/anamnesisApi";
import FileAnamnesisType from "./types/file-anamnesis-type";
import { FileCustom } from "@/hooks/use-file-input";

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
    value: selectedTypes,
    isValid: typeIsValid,
    hasError: typeInputHasError,
    valueChangeHandler: typeChangeHandler,
    inputBlurHandler: typeBlurHandler,
    reset: resetType,
    errorMessage: typeErrorMessage,
    setItem: setType,
  } = useDropdown({ validateValue: atLeastOneSelectedArray });

  const [selectedFiles, setSelectedFiles] = useState<FileCustom[] | undefined>(
    undefined
  );

  useEffect(() => {
    let today = new Date();
    setDate(formatDateTime(today));
  }, []);

  const handleSubmit = async () => {
    let anamnesisTypeContentsIsValid: boolean | string | undefined = true;
    selectedTypes &&
      (selectedTypes as ItemAnamnesis[]).length > 0 &&
      (selectedTypes as ItemAnamnesis[]).forEach((type) => {
        if (type.description !== "Arquivo") {
          anamnesisTypeContentsIsValid =
            anamnesisTypeContentsIsValid && type.anamnesisTypeContentIsValid;
        }
      });
    if (!enteredDateIsValid || !typeIsValid || !anamnesisTypeContentsIsValid) {
      dateBlurHandler(undefined);
      typeBlurHandler();
      return;
    }

    setIsLoading(true);

    const dateObject = new Date(enteredDate);

    const selectedTypesArray = (selectedTypes as ItemAnamnesis[]).filter(
      (type) => type.selected
    );
    const anamnesisTypeContents = selectedTypesArray.map(
      (item) =>
        new CreateAnamnesisTypeContentRequest(
          item.id,
          item.description,
          item.value.isDefault,
          item.anamnesisTypeContent
        )
    );

    const createAnamnesisRequest = new CreateAnamnesisRequest(
      router.query.customerId as string,
      dateObject,
      anamnesisTypeContents
    );

    const apiResponse = await createAnamnesis(
      userCustom.accessToken,
      createAnamnesisRequest,
      selectedFiles
    );

    if (apiResponse.ok) {
      //if (true) {
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
            <DropdownAnamnesisTypes
              label={"Tipo(s) da Anamnese(s):"}
              id={"anamnesis-type-create"}
              idPropertyName={"anamnesisTypeId"}
              descriptionPropertyName={"anamnesisTypeDescription"}
              selectedValues={selectedTypes}
              onBlurHandler={typeBlurHandler}
              onChangeHandler={typeChangeHandler}
              hasError={typeInputHasError}
              errorMessage="O tipo da anamenese deve ser selecionado"
            />
          </div>
        </div>
        <div className={classes.header_container_right}>
          <Button style={ButtonStyle.SUCCESS} onClickHandler={handleSubmit}>
            Salvar
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
        {selectedTypes &&
          (selectedTypes as ItemAnamnesis[]).length > 0 &&
          (selectedTypes as ItemAnamnesis[])?.map((type) => {
            if (type.description === "Arquivo") {
              return (
                <FileAnamnesisType
                  key={type.id}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  anamnesisTypeId={type.id}
                  selectedTypes={selectedTypes}
                  setTypes={setType}
                />
              );
            } else {
              return (
                <AnamnesisFreeTypeForm
                  key={type.id}
                  anamnesisTypeId={type.id}
                  template={type.value.template}
                  selectedTypes={selectedTypes}
                  setTypes={setType}
                  anamnesisTypeDescription={type.description}
                  anamnesisTypeContent={type.anamnesisTypeContent}
                  anamnesisTypeContentIsValid={type.anamnesisTypeContentIsValid}
                />
              );
            }
          })}
      </section>
    </>
  );
};

export default CreateAnamnesis;
