/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./create-anamnesis.module.css";
import PersonalInfo from "../edit/personal-info";

import { useRouter } from "next/router";
import useInput from "@/hooks/use-input";
import { atLeastOneSelectedArray, isNotEmpty } from "@/util/field-validations";
import { useCallback, useContext, useEffect, useState } from "react";
import useDropdown from "@/hooks/use-dropdown";
import AnamnesisFreeTypeForm from "./types/free-type";
import Button, { ButtonStyle } from "@/components/ui/button";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";
import {
  getAnamnesisById,
  updateAnamnesis,
} from "@/api/customers/anamnesisApi";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { GetAnamnesisByIdResponse } from "@/models/customers/GetAnamnesisByIdResponse";
import {
  UpdateAnamnesisRequest,
  UpdateAnamnesisTypeContentRequest,
} from "@/models/customers/UpdateAnamnesisRequest";
import { UpdateAnamnesisResponse } from "@/models/customers/UpdateAnamnesisResponse";
import { formatDateTime } from "@/util/date-helpers";
import DropdownAnamnesisTypes, {
  ItemAnamnesis,
} from "@/components/ui/dropdown-anamnesis-type";
import FileAnamnesisType from "./types/file-anamnesis-type";
import { FileCustom } from "@/hooks/use-file-input";

const EditAnamnesis = () => {
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
    value: selectedAnamnesisTypes,
    isValid: anamnesisTypesIsValid,
    hasError: anamnesisTypesDropdownHasError,
    valueChangeHandler: anamnesisTypesDropdownChangeHandler,
    inputBlurHandler: anamnesisTypesDropdownBlurHandler,
    reset: resetAnamnesisDropdown,
    errorMessage: anamnesisDropdownErrorMessage,
    setItem: setSelectedAnamnesisTypes,
  } = useDropdown({ validateValue: atLeastOneSelectedArray });

  const [selectedFiles, setSelectedFiles] = useState<FileCustom[] | undefined>(
    undefined
  );

  const getAnamnesisByIdAsync = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getAnamnesisById(
          userCustom.accessToken,
          router.query.customerId as string,
          router.query.anamnesisId as string
        );
        if (response.ok) {
          const apiResponseBody = response.body as GetAnamnesisByIdResponse;
          setDate(formatDateTime(apiResponseBody.date));
          const newSelectedTypes: ItemAnamnesis[] = [];
          for (const typeContent of apiResponseBody.anamnesisTypesContent) {
            const selectedType: ItemAnamnesis = {
              id: typeContent.anamnesisTypeId,
              description: typeContent.anamnesisTypeDescription,
              selected: true,
              value: typeContent,
              show: true,
              anamnesisTypeContent: typeContent.content,
              anamnesisTypeContentIsValid: true,
            };
            newSelectedTypes.push(selectedType);
            if (
              typeContent.anamnesisTypeDescription === "Arquivo" &&
              typeContent.files
            ) {
              const typeContentFiles: FileCustom[] = [];
              for (let i = 0; i < typeContent.files.length; i++) {
                let response = await fetch(
                  `${typeContent.files[i].baseUrl}?${typeContent.files[i].sasToken}`
                );
                let data = await response.blob();
                let metadata = {
                  type: data.type,
                };
                //let photoName = `before-photo-${i}.${data.type.split("/")[1]}`;
                let photoName = typeContent.files[i].originalName;
                let typeContentFileObject = new File(
                  [data],
                  photoName,
                  metadata
                );
                typeContentFiles.push({
                  file: typeContentFileObject,
                  id: typeContent.files[i].fileId,
                  name: photoName,
                  url: URL.createObjectURL(typeContentFileObject),
                });
              }
              setSelectedFiles(typeContentFiles);
            }
          }
          setSelectedAnamnesisTypes(newSelectedTypes);
        }
      } catch (error: any) {
        const notification = {
          status: "error",
          title: "Opsss...",
          message:
            "Tivemos um problema passageiro. Aguarde alguns segundos e tente novamente!",
        };
        notificationCtx.showNotification(notification);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userCustom?.accessToken, router.query]);

  useEffect(() => {
    setIsLoading(true);

    if (
      userCustom?.accessToken &&
      router.query.customerId &&
      router.query.anamnesisId
    ) {
      getAnamnesisByIdAsync();
    }
  }, [
    userCustom?.accessToken,
    router.query.customerId,
    router.query.anamnesisId,
  ]);

  const handleSubmit = async () => {
    let anamnesisTypeContentsIsValid: boolean | string | undefined = true;
    selectedAnamnesisTypes &&
      (selectedAnamnesisTypes as ItemAnamnesis[]).length > 0 &&
      (selectedAnamnesisTypes as ItemAnamnesis[]).forEach((type) => {
        if (type.description !== "Arquivo") {
          anamnesisTypeContentsIsValid =
            anamnesisTypeContentsIsValid && type.anamnesisTypeContentIsValid;
        }
      });

    if (
      !enteredDateIsValid ||
      !anamnesisTypesIsValid ||
      !anamnesisTypeContentsIsValid
    ) {
      dateBlurHandler(undefined);
      anamnesisTypesDropdownBlurHandler();
      return;
    }

    setIsLoading(true);

    const dateObject = new Date(enteredDate);

    const selectedAnamnesisTypesArray = (
      selectedAnamnesisTypes as ItemAnamnesis[]
    ).filter((type) => type.selected);
    const anamnesisTypeContents = selectedAnamnesisTypesArray.map(
      (item) =>
        new UpdateAnamnesisTypeContentRequest(
          item.id,
          item.description,
          item.value.isDefault,
          item.anamnesisTypeContent
        )
    );

    const updateAnamnesisRequest = new UpdateAnamnesisRequest(
      router.query.anamnesisId as string,
      router.query.customerId as string,
      dateObject,
      anamnesisTypeContents
    );

    const apiResponse = await updateAnamnesis(
      userCustom.accessToken,
      updateAnamnesisRequest,
      selectedFiles
    );

    if (apiResponse.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "Sua anamnese foi atualizada com sucesso!",
      };
      notificationCtx.showNotification(notification);

      const apiResponseBody = apiResponse.body as UpdateAnamnesisResponse;
      //setDate(new Date(apiResponseBody.date).toISOString().split("T")[0]);
      setDate(formatDateTime(new Date(apiResponseBody.date)));
      const newSelectedTypes: ItemAnamnesis[] = [];
      apiResponseBody.anamnesisTypesContent.forEach((typeContent) => {
        const selectedType: ItemAnamnesis = {
          id: typeContent.anamnesisTypeId,
          description: typeContent.anamnesisTypeDescription,
          selected: true,
          value: typeContent,
          show: true,
          anamnesisTypeContent: typeContent.content,
          anamnesisTypeContentIsValid: true,
        };
        newSelectedTypes.push(selectedType);
      });
      setSelectedAnamnesisTypes(newSelectedTypes);
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
        <p className={classes.title}>Editando Anamnese</p>
      </section>
      <section className={classes.header_container}>
        <div className={classes.header_container_left}>
          <div>
            <Input
              type={InputType.DATE_TIME}
              label={"Data"}
              id={"anamnesis-date-edit"}
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
              id={"anamnesis-type-edit"}
              idPropertyName={"anamnesisTypeId"}
              descriptionPropertyName={"anamnesisTypeDescription"}
              selectedValues={selectedAnamnesisTypes}
              onBlurHandler={anamnesisTypesDropdownBlurHandler}
              onChangeHandler={anamnesisTypesDropdownChangeHandler}
              hasError={anamnesisTypesDropdownHasError}
              errorMessage="O tipo da anamnese deve ser selecionado"
            />
          </div>
        </div>
        <div className={classes.header_container_right}>
          <Button style={ButtonStyle.SUCCESS} onClickHandler={handleSubmit}>
            Salvar
          </Button>
          <Button
            style={ButtonStyle.NEUTRAL}
            onClickHandler={() =>
              router.replace(`/clientes/editar/${router.query.customerId}`)
            }
          >
            Cancelar
          </Button>
        </div>
      </section>
      <section className={classes.anaminesis_body}>
        {selectedAnamnesisTypes &&
          (selectedAnamnesisTypes as ItemAnamnesis[]).length > 0 &&
          (selectedAnamnesisTypes as ItemAnamnesis[])?.map((type) => {
            if (type.description === "Arquivo") {
              return (
                <FileAnamnesisType
                  key={type.id}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  anamnesisTypeId={type.id}
                  selectedTypes={selectedAnamnesisTypes}
                  setTypes={setSelectedAnamnesisTypes}
                />
              );
            } else {
              return (
                <AnamnesisFreeTypeForm
                  key={type.id}
                  anamnesisTypeId={type.id}
                  template={
                    type.value.template && type.value.template !== ""
                      ? type.value.template
                      : type.value.content
                  }
                  selectedTypes={selectedAnamnesisTypes}
                  setTypes={setSelectedAnamnesisTypes}
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

export default EditAnamnesis;
