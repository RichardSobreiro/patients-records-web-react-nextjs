/** @format */

import LoadingSpinner from "@/components/ui/loading-spinner";
import PersonalInfo from "../edit/personal-info";
import { NotificationContext } from "@/store/notification-context";
import classes from "./create-service.module.css";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import Input, { InputType } from "@/components/ui/input";
import { atLeastOneSelectedArray, isNotEmpty } from "@/util/field-validations";
import useInput from "@/hooks/use-input";
import useDropdown from "@/hooks/use-dropdown";
import Button, { ButtonStyle } from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";
import useFileInput from "@/hooks/use-file-input";
import DropdownServiceTypes, {
  Item,
} from "@/components/ui/dropdown-service-type";
import { types } from "util";
import { CreateServiceRequest } from "@/models/customers/services/CreateServiceRequest";
import { GetServiceTypeResponse } from "@/models/customers/service-types/GetServiceTypesResponse";
import { createService } from "@/api/customers/servicesApi";

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
    value: selectedTypes,
    isValid: typeIsValid,
    hasError: typeInputHasError,
    valueChangeHandler: typeChangeHandler,
    inputBlurHandler: typeBlurHandler,
    reset: resetType,
    errorMessage: typeErrorMessage,
    setItem: setType,
  } = useDropdown({ validateValue: atLeastOneSelectedArray });

  const {
    value: beforeComments,
    isValid: beforeCommentsIsValid,
    hasError: beforeCommentsInputHasError,
    valueChangeHandler: beforeCommentsChangedHandler,
    inputBlurHandler: beforeCommentsBlurHandler,
    reset: resetBeforeCommentsInput,
    setEnteredValue: setBeforeComments,
  } = useInput({ validateValue: () => true });

  const {
    selectedPhotos: selectedBeforePhotos,
    isValid: selectedBeforePhotosIsValid,
    hasError: selectedBeforePhotosHasError,
    valueChangeHandler: selectedBeforePhotosChangeHandler,
    inputBlurHandler: selectedBeforePhotosBlurHandler,
    reset: resetSelectedBeforePhotos,
    errorMessage: selectedBeforePhotosErrorMessage,
  } = useFileInput({ validateValue: () => true });

  const {
    value: afterComments,
    isValid: afterCommentsIsValid,
    hasError: afterCommentsInputHasError,
    valueChangeHandler: afterCommentsChangedHandler,
    inputBlurHandler: afterCommentsBlurHandler,
    reset: resetAfterCommentsInput,
    setEnteredValue: setAfterComments,
  } = useInput({ validateValue: () => true });

  const {
    selectedPhotos: selectedAfterPhotos,
    isValid: selectedAfterPhotosIsValid,
    hasError: selectedAfterPhotosHasError,
    valueChangeHandler: selectedAfterPhotosChangeHandler,
    inputBlurHandler: selectedAfterPhotosBlurHandler,
    reset: resetSelectedAfterPhotos,
    errorMessage: selectedAfterPhotosErrorMessage,
  } = useFileInput({ validateValue: () => true });

  useEffect(() => {
    let today = new Date();
    setDate(today.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = async () => {
    if (!enteredDateIsValid || !typeIsValid) {
      typeBlurHandler();
      return;
    }
    setIsLoading(true);

    const dateObject = new Date(enteredDate.replace(/-/g, "/"));

    const selectedTypesArray = selectedTypes as Item[];
    const serviceTypesSelected = selectedTypesArray.map(
      (item) =>
        new GetServiceTypeResponse(
          item.id,
          item.description,
          item.value.notes,
          item.value.isDefault
        )
    );

    const request = new CreateServiceRequest(
      dateObject,
      serviceTypesSelected,
      beforeComments,
      selectedBeforePhotos,
      afterComments,
      selectedAfterPhotos
    );

    const apiResponse = await createService(
      userCustom.accessToken,
      router.query.customerId as string,
      request
    );

    if (apiResponse.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "O atendimento foi criado com sucesso!",
      };
      notificationCtx.showNotification(notification);
      router.replace(
        `/clientes/editar/${apiResponse.body.customerId}/services/${apiResponse.body.serviceId}/editar`
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
            <DropdownServiceTypes
              label={"Tipo(s) do Atendimento:"}
              id={"service-type-create"}
              idPropertyName={"serviceTypeId"}
              descriptionPropertyName={"serviceTypeDescription"}
              selectedValues={selectedTypes}
              onBlurHandler={typeBlurHandler}
              onChangeHandler={typeChangeHandler}
              hasError={typeInputHasError}
              errorMessage="O tipo do atendimento deve ser selecionado"
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
        <InputFile
          label={"Fotos do Antes:"}
          hasError={selectedBeforePhotosHasError}
          errorMessage={selectedBeforePhotosErrorMessage}
          selectedPhotos={selectedBeforePhotos}
          onChangeHandler={selectedBeforePhotosChangeHandler}
          onBlurHandler={selectedBeforePhotosBlurHandler}
        />
      </section>

      <section className={classes.before_container}>
        <p className={classes.step_title}>
          Informações de Depois do Atendimento:
        </p>
        <div className={classes.before_comments_container}>
          <TextArea
            label={"Observações de Depois do Atendimento:"}
            id={"before-comments-create-service"}
            hasError={afterCommentsInputHasError}
            errorMessage={
              "Os comentários de depois do atendimento são inválidos"
            }
            rows={5}
            required={false}
            value={afterComments}
            onChangeHandler={afterCommentsChangedHandler}
            onBlurHandler={afterCommentsBlurHandler}
          />
        </div>

        <InputFile
          label={"Fotos do Depois:"}
          hasError={selectedAfterPhotosHasError}
          errorMessage={selectedAfterPhotosErrorMessage}
          selectedPhotos={selectedAfterPhotos}
          onChangeHandler={selectedAfterPhotosChangeHandler}
          onBlurHandler={selectedAfterPhotosBlurHandler}
        />
      </section>
    </>
  );
};

export default CreateService;
