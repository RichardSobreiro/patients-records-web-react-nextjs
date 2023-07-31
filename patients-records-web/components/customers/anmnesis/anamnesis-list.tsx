/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./anamnesis-list.module.css";
import Dropdown, { Item } from "@/components/ui/dropdown";
import { anamnesisTypesList } from "@/util/constants/lists";
import Button, { ButtonStyle } from "@/components/ui/button";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/store/notification-context";
import { getAnamnesis } from "@/api/customers/anamnesisApi";
import { GetAnamnesisResponse } from "@/models/customers/GetAnamnesisResponse";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AnamnesisListRow from "./anamnesis-list-row";
import useInput from "@/hooks/use-input";
import useDropdown from "@/hooks/use-dropdown";
import { isDate } from "@/util/field-validations";
import Pagination from "@/components/ui/pagination";
import DropdownAnamnesisTypes, {
  ItemAnamnesis,
} from "@/components/ui/dropdown-anamnesis-type";

const PAGE_SIZE = 10;

const AnamnesisList = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationCtx = useContext(NotificationContext);
  const [anamnesisList, setAnamnesisList] = useState<
    GetAnamnesisResponse | undefined
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
    reset: resetstartDateInput,
    setEnteredValue: setstartDate,
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
    value: selectedAnamnesisTypes,
    isValid: anamnesisTypesIsValid,
    hasError: anamnesisTypesDropdownHasError,
    valueChangeHandler: anamnesisTypesDropdownChangeHandler,
    inputBlurHandler: anamnesisTypesDropdownBlurHandler,
    reset: resetAnamnesisDropdown,
    errorMessage: anamnesisDropdownErrorMessage,
    setItem: setSelectedAnamnesisTypes,
  } = useDropdown({ validateValue: () => true });

  const getAnamnesisList = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const startDateObject = isDate(startDate)
          ? new Date(startDate)
          : undefined;
        const endDateObject = isDate(endDate) ? new Date(endDate) : undefined;

        const response = await getAnamnesis(
          userCustom.accessToken,
          currentPage as string,
          PAGE_SIZE as unknown as string,
          router.query.customerId as string,
          startDateObject,
          endDateObject,
          (selectedAnamnesisTypes as ItemAnamnesis[])?.map((type) => type.id)
        );
        if (response.ok) {
          const apiResponseBody = response.body as GetAnamnesisResponse;
          setAnamnesisList(apiResponseBody);
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
  }, [
    userCustom?.accessToken,
    router.query,
    startDate,
    endDate,
    selectedAnamnesisTypes,
    currentPage,
  ]);

  useEffect(() => {
    setIsLoading(true);

    if (userCustom?.accessToken && router.query.customerId) {
      getAnamnesisList();
    }
  }, [userCustom?.accessToken, router.query.customerId]);

  const onSubmitFilter = async () => {
    if (!startDateIsValid || !endDateIsValid) {
      return;
    }
    setIsLoading(true);
    await getAnamnesisList();
  };

  useEffect(() => {
    onSubmitFilter();
  }, [currentPage]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <section className={classes.anamnesis_container}>
        <div className={classes.title}>
          <p>Anamneses</p>
        </div>
        <div className={classes.search_container}>
          <div className={classes.search_container_left}>
            <div>
              <Input
                type={InputType.DATE_TIME}
                label={"Início (Data da Anamnese)"}
                id={"start-date-anamnesis-list"}
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
                label={"Fim (Data da Anamnese)"}
                id={"end-date-anamnesis-list"}
                hasError={endEndInputHasError}
                errorMessage={endDateErrorMessage}
                value={endDate}
                onChangeHandler={endDateChangedHandler}
                onBlurHandler={endDateBlurHandler}
              />
            </div>
            <div>
              <DropdownAnamnesisTypes
                label={"Tipo(s) da Anamnese(s):"}
                id={"anamnesis-type-dropdown-list"}
                idPropertyName={"anamnesisTypeId"}
                descriptionPropertyName={"anamnesisTypeDescription"}
                selectedValues={selectedAnamnesisTypes}
                onBlurHandler={anamnesisTypesDropdownBlurHandler}
                onChangeHandler={anamnesisTypesDropdownChangeHandler}
                hasError={anamnesisTypesDropdownHasError}
                errorMessage="O tipo da anamnese deve ser selecionado"
                onlyFilter={true}
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
                  `/clientes/editar/${router.query.customerId}/anamneses/criar`
                );
              }}
            >
              + Anamnese
            </Button>
          </div>
        </div>
        <div className={classes.anamnesis_list_table}>
          <div className={classes.table_header}>
            <div className={classes.table_header_cell}>Tipo</div>
            <div className={classes.table_header_cell}>Data da Anamnese</div>
            <div className={classes.table_header_cell}></div>
          </div>
          <div className={classes.table_body}>
            {anamnesisList &&
              anamnesisList?.count > 0 &&
              anamnesisList?.anamnesis?.map((anamnesis) => (
                <AnamnesisListRow
                  key={anamnesis.anamneseId}
                  anamnesis={anamnesis}
                />
              ))}
            {!anamnesisList ||
              (anamnesisList?.count == 0 && (
                <p className={classes.list_empty}>
                  Nenhuma anamnese encontrada!
                </p>
              ))}
            {anamnesisList && anamnesisList?.count > 0 && (
              <Pagination
                className="pagination_bar"
                currentPage={currentPage as number}
                siblingCount={2}
                totalCount={anamnesisList?.count}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AnamnesisList;
