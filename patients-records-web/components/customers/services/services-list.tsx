/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./services-list.module.css";
import Dropdown, { Item } from "@/components/ui/dropdown";
import { serviceTypes } from "@/util/constants/lists";
import Button, { ButtonStyle } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/store/notification-context";
import { GetServicesResponse } from "@/models/customers/services/GetServicesResponse";
import { getServices } from "@/api/customers/servicesApi";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ServiceListRow from "./service-list-row";
import useInput from "@/hooks/use-input";
import { isDate } from "@/util/field-validations";
import useDropdown from "@/hooks/use-dropdown";
import DropdownServiceTypes from "@/components/ui/dropdown-service-type";

const PAGE_SIZE = 10;

const ServicesList = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationCtx = useContext(NotificationContext);
  const [servicesList, setServicesList] = useState<
    GetServicesResponse | undefined
  >();

  const [currentPage, setCurrentPage] = useState<number | string>(1);

  const userCustom: any = session?.user;

  const {
    value: startDate,
    isValid: startDateIsValid,
    hasError: startDateInputHasError,
    errorMessage: startDateErrorMessage,
    valueChangeHandler: startDateChangedHandler,
    inputBlurHandler: startDateBlurHandler,
    reset: resetStartDateInput,
    setEnteredValue: setStartDate,
  } = useInput({ validateValue: () => true });

  const validateEndDate = (
    endDate?: string,
    startDate?: string
  ): boolean | string => {
    if (!isDate(startDate!) && !isDate(endDate!)) {
      return true;
    } else if (
      (!isDate(startDate!) && isDate(endDate!)) ||
      (isDate(startDate!) && !isDate(endDate!))
    ) {
      return "As datas de início e fim devem ser preenchidas";
    } else if (isDate(startDate!) && isDate(endDate!)) {
      const startDateObject = new Date(startDate!);
      const endDateObject = new Date(endDate!);
      if (startDateObject > endDateObject) {
        return "A data de início deve ser menor que a data fim";
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const {
    value: endDate,
    isValid: endDateIsValid,
    hasError: endEndInputHasError,
    errorMessage: endDateErrorMessage,
    valueChangeHandler: endDateChangedHandler,
    inputBlurHandler: endDateBlurHandler,
    reset: resetEndDateInput,
    setEnteredValue: setEndDate,
  } = useInput({
    validateValue: validateEndDate,
    secondValueValidationFunction: startDate,
  });

  const {
    value: selectedTypes,
    isValid: typeIsValid,
    hasError: typeInputHasError,
    valueChangeHandler: typeChangeHandler,
    inputBlurHandler: typeBlurHandler,
    reset: resetType,
    errorMessage: typeErrorMessage,
    setItem: setType,
  } = useDropdown({ validateValue: () => true });

  const getServiceList = useCallback(async () => {
    if (userCustom?.accessToken) {
      const startDateObject = isDate(startDate)
        ? new Date(startDate)
        : undefined;
      const endDateObject = isDate(endDate) ? new Date(endDate) : undefined;

      const selectedTypesIds = (selectedTypes as Item[])
        ?.filter((type) => type.selected)
        ?.map((selectedType) => selectedType.id);

      try {
        const response = await getServices(
          userCustom.accessToken,
          currentPage as string,
          PAGE_SIZE as unknown as string,
          router.query.customerId as string,
          startDateObject,
          endDateObject,
          selectedTypesIds
        );
        if (response.ok) {
          const apiResponseBody = response.body as GetServicesResponse;
          setServicesList(apiResponseBody);
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
  }, [
    userCustom?.accessToken,
    router.query,
    endDate,
    startDate,
    selectedTypes,
    currentPage,
  ]);

  useEffect(() => {
    setIsLoading(true);

    if (userCustom?.accessToken && router.query.customerId) {
      getServiceList();
    }
  }, [userCustom?.accessToken, router.query.customerId]);

  const onSubmitFilter = async () => {
    if (!startDateIsValid || !endDateIsValid) {
      return;
    }
    setIsLoading(true);
    await getServiceList();
  };

  useEffect(() => {
    onSubmitFilter();
  }, [currentPage]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <section className={classes.services_container}>
        <div className={classes.title}>
          <p>Atendimentos</p>
        </div>
        <div className={classes.search_container}>
          <div className={classes.search_container_left}>
            <div>
              <Input
                type={InputType.DATE_TIME}
                label={"Início (Data do Atendimento)"}
                id={"start-date-services-list"}
                hasError={startDateInputHasError}
                errorMessage={startDateErrorMessage}
                value={startDate}
                onChangeHandler={startDateChangedHandler}
                onBlurHandler={startDateBlurHandler}
              />
            </div>
            <div>
              <Input
                type={InputType.DATE_TIME}
                label={"Fim (Data do Atendimento)"}
                id={"end-date-services-list"}
                hasError={endEndInputHasError}
                errorMessage={endDateErrorMessage}
                value={endDate}
                onChangeHandler={endDateChangedHandler}
                onBlurHandler={endDateBlurHandler}
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
              />
            </div>
            <div className={classes.filter_button_group}>
              <Button
                style={ButtonStyle.PRIMARY_BODERED}
                onClickHandler={onSubmitFilter}
              >
                Filtrar
              </Button>
            </div>
          </div>
          <div className={classes.search_container_right}>
            <Button
              style={ButtonStyle.SUCCESS}
              onClickHandler={() => {
                router.push(
                  `/clientes/editar/${router.query.customerId}/atendimentos/criar`
                );
              }}
            >
              + Atendimento
            </Button>
          </div>
        </div>
        <div className={classes.services_list_table}>
          <div className={classes.table_header}>
            <div className={classes.table_header_cell}>Tipo</div>
            <div className={classes.table_header_cell}>Data</div>
            <div className={classes.table_header_cell}></div>
          </div>
          <div className={classes.table_body}>
            {servicesList &&
              servicesList?.servicesCount > 0 &&
              servicesList?.servicesList?.map((service) => (
                <ServiceListRow key={service.serviceId} service={service} />
              ))}
            {!servicesList ||
              (servicesList?.servicesCount == 0 && (
                <p className={classes.list_empty}>
                  Nenhum atendimento encontrado!
                </p>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesList;
