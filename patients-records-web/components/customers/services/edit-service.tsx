/** @format */

import LoadingSpinner from "@/components/ui/loading-spinner";
import PersonalInfo from "../edit/personal-info";
import { NotificationContext } from "@/store/notification-context";
import classes from "./edit-service.module.css";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";
import Input, { InputType } from "@/components/ui/input";
import { atLeastOneSelectedArray, isNotEmpty } from "@/util/field-validations";
import useInput from "@/hooks/use-input";
import useDropdown from "@/hooks/use-dropdown";
import Button, { ButtonStyle } from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";
import useFileInput, { FileCustom } from "@/hooks/use-file-input";
import DropdownServiceTypes, {
  Item,
} from "@/components/ui/dropdown-service-type";
import { getServiceById, updateService } from "@/api/customers/servicesApi";
import { GetServiceByIdResponse } from "@/models/customers/services/GetServiceByIdResponse";
import { GetServicePhotosResponse } from "@/models/customers/services/GetServicePhotosResponse";
import { GetServiceTypeResponse } from "@/models/customers/service-types/GetServiceTypesResponse";
import { UpdateServiceRequest } from "@/models/customers/services/UpdateServiceRequest";
import { formatDateTime } from "@/util/date-helpers";

const EditService = () => {
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
    selectedFile: selectedBeforePhotos,
    isValid: selectedBeforePhotosIsValid,
    hasError: selectedBeforePhotosHasError,
    valueChangeHandler: selectedBeforePhotosChangeHandler,
    inputBlurHandler: selectedBeforePhotosBlurHandler,
    reset: resetSelectedBeforePhotos,
    errorMessage: selectedBeforePhotosErrorMessage,
    setSelectedFile: setBeforePhotos,
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
    selectedFile: selectedAfterPhotos,
    isValid: selectedAfterPhotosIsValid,
    hasError: selectedAfterPhotosHasError,
    valueChangeHandler: selectedAfterPhotosChangeHandler,
    inputBlurHandler: selectedAfterPhotosBlurHandler,
    reset: resetSelectedAfterPhotos,
    errorMessage: selectedAfterPhotosErrorMessage,
    setSelectedFile: setAfterPhotos,
  } = useFileInput({ validateValue: () => true });

  const getAndSetPhotosAsync = async (
    beforePhotos: GetServicePhotosResponse[] | null | undefined,
    afterPhotos: GetServicePhotosResponse[] | null | undefined
  ) => {
    const beforePhotoFiles: FileCustom[] = [];
    if (beforePhotos) {
      for (let i = 0; i < beforePhotos?.length; i++) {
        let response = await fetch(beforePhotos[i].url);
        let data = await response.blob();
        let metadata = {
          type: data.type,
        };
        let photoName = `before-photo-${i}.${data.type.split("/")[1]}`;
        let photoFile = new File([data], photoName, metadata);
        beforePhotoFiles.push({
          file: photoFile,
          id: beforePhotos[i].servicePhotoId,
          name: photoName,
          url: URL.createObjectURL(photoFile),
        });
      }
      setBeforePhotos(beforePhotoFiles);
    }

    const afterPhotoFiles: FileCustom[] = [];
    if (afterPhotos) {
      for (let i = 0; i < afterPhotos?.length; i++) {
        let response = await fetch(afterPhotos[i].url);
        let data = await response.blob();
        let metadata = {
          type: data.type,
        };
        let photoName = `after-photo-${i}.${data.type.split("/")[1]}`;
        let photoFile = new File(
          [data],
          `after-photo-${i}.${data.type.split("/")[1]}`,
          metadata
        );
        afterPhotoFiles.push({
          file: photoFile,
          id: afterPhotos[i].servicePhotoId,
          name: photoName,
          url: URL.createObjectURL(photoFile),
        });
      }
      setAfterPhotos(afterPhotoFiles);
    }
  };

  const getServiceByIdAsync = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getServiceById(
          userCustom.accessToken,
          router.query.customerId as string,
          router.query.serviceId as string
        );
        if (response.ok) {
          const apiResponseBody = response.body as GetServiceByIdResponse;
          //setDate(new Date(apiResponseBody.date).toISOString().split("T")[0]);
          setDate(formatDateTime(apiResponseBody.date));
          apiResponseBody.afterNotes &&
            setAfterComments(apiResponseBody.afterNotes);
          apiResponseBody.beforeNotes &&
            setBeforeComments(apiResponseBody.beforeNotes);
          setType(
            apiResponseBody.serviceTypes.map((type) => {
              return {
                id: type.serviceTypeId,
                description: type.serviceTypeDescription,
                selected: true,
                value: type,
              } as Item;
            })
          );
          getAndSetPhotosAsync(
            apiResponseBody.beforePhotos,
            apiResponseBody.afterPhotos
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
      router.query.serviceId
    ) {
      getServiceByIdAsync();
    }
  }, [
    userCustom?.accessToken,
    router.query.customerId,
    router.query.serviceId,
  ]);

  const handleSubmit = async () => {
    if (!enteredDateIsValid || !typeIsValid) {
      typeBlurHandler();
      return;
    }
    setIsLoading(true);

    //const dateObject = new Date(enteredDate.replace(/-/g, "/"));
    const dateObject = new Date(enteredDate);

    const selectedTypesArray = (selectedTypes as Item[]).filter(
      (type) => type.selected
    );
    const serviceTypesSelected = selectedTypesArray.map(
      (item) =>
        new GetServiceTypeResponse(
          item.id,
          item.description,
          item.value.notes,
          item.value.isDefault
        )
    );

    const request = new UpdateServiceRequest(
      router.query.serviceId as string,
      dateObject,
      serviceTypesSelected,
      beforeComments,
      selectedBeforePhotos,
      afterComments,
      selectedAfterPhotos
    );

    const apiResponse = await updateService(
      userCustom.accessToken,
      router.query.customerId as string,
      router.query.serviceId as string,
      request
    );

    if (apiResponse.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "O atendimento foi atualizado com sucesso!",
      };
      notificationCtx.showNotification(notification);
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
        <p className={classes.title}>Editando Atendimento</p>
      </section>

      <section className={classes.header_container}>
        <div className={classes.header_container_left}>
          <div>
            <Input
              type={InputType.DATE_TIME}
              label={"Data do Atendimento:"}
              id={"service-date-edit"}
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
              id={"service-type-edit"}
              idPropertyName={"serviceTypeId"}
              descriptionPropertyName={"serviceTypeDescription"}
              selectedValues={selectedTypes}
              onBlurHandler={typeBlurHandler}
              onChangeHandler={typeChangeHandler}
              hasError={typeInputHasError}
              errorMessage="O tipo do atendimento deve ser selecionado"
              allowAddNewType={true}
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
              router.push(`/clientes/editar/${router.query.customerId}`)
            }
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
            id={"before-comments-edit-service"}
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
          selectedFiles={selectedBeforePhotos}
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
            id={"after-comments-edit-service"}
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
          selectedFiles={selectedAfterPhotos}
          onChangeHandler={selectedAfterPhotosChangeHandler}
          onBlurHandler={selectedAfterPhotosBlurHandler}
        />
      </section>
    </>
  );
};

export default EditService;
