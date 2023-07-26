/** @format */

import Input, { InputType } from "../ui/input";
import classes from "./filter.module.css";

import Image from "next/image";
import useInput from "@/hooks/use-input";
import { useState } from "react";
import Modal, { ModalTheme } from "../ui/modal";
import Button, { ButtonStyle } from "../ui/button";
import { useRouter } from "next/router";
import CreateCustomerModalContent from "./create/create-customer-modal";
import { isDate } from "@/util/field-validations";
import DropdownServiceTypes from "../ui/dropdown-service-type";
import useDropdown from "@/hooks/use-dropdown";

type Props = {
  currentPage: string | number;
  getCustomersAsync: (
    customerName?: string,
    startDate?: Date,
    endDate?: Date
  ) => void;
  setIsLoading: any;
};

const Filter = ({ currentPage, getCustomersAsync, setIsLoading }: Props) => {
  const router = useRouter();

  const [lastServiceDateModalIsOpen, setLastServiceDateModalIsOpen] =
    useState<boolean>(false);

  const [lastServiceTypeModalIsOpen, setLastServiceTypeModalIsOpen] =
    useState<boolean>(false);

  const [createCustomerModalIsOpen, setCreateCustomerModalIsOpen] =
    useState<boolean>(false);

  const {
    value: enteredText,
    isValid: enteredTextIsValid,
    hasError: enteredTextInputHasError,
    valueChangeHandler: enteredTextChangedHandler,
    inputBlurHandler: enteredTextBlurHandler,
    reset: resetEnteredTextInput,
  } = useInput({ validateValue: () => true });

  const validateLastServiceDateStart = (
    strLastServiceDateStart: string
  ): boolean => {
    const dateStart = new Date(strLastServiceDateStart.replace(/-/g, "/"));
    if (strLastServiceDateStart != "" && dateStart > new Date()) return false;

    return true;
  };

  const {
    value: enteredLastServiceDateStart,
    isValid: enteredLastServiceDateStartIsValid,
    hasError: enteredLastServiceDateStartInputHasError,
    valueChangeHandler: enteredLastServiceDateStartChangedHandler,
    inputBlurHandler: enteredLastServiceDateStartBlurHandler,
    reset: resetenteredLastServiceDateStartTextInput,
  } = useInput({ validateValue: validateLastServiceDateStart });

  const validateLastServiceDateEnd = (
    strLastServiceDateEnd: string
  ): boolean => {
    // if (isNaN(Date.parse(strLastServiceDate))) return false;

    const dateEnd = new Date(strLastServiceDateEnd.replace(/-/g, "/"));
    if (strLastServiceDateEnd != "" && dateEnd > new Date()) return false;

    const dateStart = new Date(enteredLastServiceDateStart.replace(/-/g, "/"));
    if (dateEnd <= dateStart) return false;

    return true;
  };

  const {
    value: enteredLastServiceDateEnd,
    isValid: enteredLastServiceDateEndIsValid,
    hasError: enteredLastServiceDateEndInputHasError,
    valueChangeHandler: enteredLastServiceDateEndChangedHandler,
    inputBlurHandler: enteredLastServiceDateEndBlurHandler,
    reset: resetenteredLastServiceDateEndTextInput,
  } = useInput({ validateValue: validateLastServiceDateEnd });

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

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    if (
      !enteredTextIsValid ||
      !enteredLastServiceDateStartIsValid ||
      !enteredLastServiceDateEndIsValid ||
      !typeIsValid
    ) {
      return;
    }

    const startDateObject = isDate(enteredLastServiceDateStart)
      ? new Date(enteredLastServiceDateStart.replace(/-/g, "/"))
      : undefined;
    const endDateObject = isDate(enteredLastServiceDateEnd)
      ? new Date(enteredLastServiceDateEnd.replace(/-/g, "/"))
      : undefined;
    setIsLoading(true);
    await getCustomersAsync(enteredText, startDateObject, endDateObject);
  };

  const dateStringToDate = (str: string) => {
    if (str != "") {
      const date = new Date(str.replace(/-/g, "/"));
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } else {
      const date = new Date();
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  return (
    <>
      <form className={classes.form} onSubmit={onSubmitHandler}>
        <div className={classes.search_group}>
          <Input
            type={InputType.TEXT}
            label={"Procurar por nome:"}
            inputStyle={{ minWidth: "20rem" }}
            id={"main-search-input"}
            hasError={enteredTextInputHasError}
            errorMessage={"O texto de busca é inválido"}
            value={enteredText}
            onChangeHandler={enteredTextChangedHandler}
            onBlurHandler={enteredTextBlurHandler}
          />
          <button type="submit" className={classes.search_button}>
            <Image
              src={`/images/search.svg`}
              alt="Search"
              width={48}
              height={48}
            />
          </button>
        </div>
        <div className={classes.actions}>
          <Button
            style={ButtonStyle.PRIMARY_BODERED}
            onClickHandler={() => {
              setCreateCustomerModalIsOpen(true);
              //router.push("/clientes/criar")
            }}
          >
            + Cliente
          </Button>
        </div>
      </form>
      <div className={classes.text_extra_filters_area}>
        <button
          className={classes.button_extra_filter}
          onClick={() => setLastServiceDateModalIsOpen(true)}
        >
          <Image src={`/images/plus.svg`} alt="Plus" width={20} height={20} />
          <p className={classes.text_extra_filters}>
            {enteredLastServiceDateStart != "" &&
            enteredLastServiceDateStartIsValid
              ? `Atendimentos entre as datas: ${dateStringToDate(
                  enteredLastServiceDateStart
                )} e ${dateStringToDate(enteredLastServiceDateEnd)}`
              : "Filtrar por data de atendimento..."}
          </p>
        </button>
        <button
          className={classes.button_extra_filter}
          onClick={() => setLastServiceTypeModalIsOpen(true)}
        >
          <Image src={`/images/plus.svg`} alt="Plus" width={20} height={20} />
          <p className={classes.text_extra_filters}>
            {enteredLastServiceType
              ? enteredLastServiceType
              : "Tipo de procedimento..."}
          </p>
        </button>
      </div>
      {lastServiceDateModalIsOpen && (
        <Modal
          onClose={() => setLastServiceDateModalIsOpen(false)}
          title="Data do último atendimento:"
          theme={ModalTheme.SECONDARY}
        >
          <Input
            type={InputType.DATE}
            labelStyle={{ color: "#171717" }}
            label={"Início"}
            id={"last-service-date-start"}
            inputStyle={{ background: "#32b44f" }}
            hasError={enteredLastServiceDateStartInputHasError}
            errorMessage={"A data início do último atendimento é inválida"}
            value={enteredLastServiceDateStart}
            onChangeHandler={enteredLastServiceDateStartChangedHandler}
            onBlurHandler={enteredLastServiceDateStartBlurHandler}
          />
          <Input
            type={InputType.DATE}
            labelStyle={{ color: "#171717" }}
            label={"Fim"}
            id={"last-service-date-end"}
            inputStyle={{ background: "#32b44f" }}
            hasError={enteredLastServiceDateEndInputHasError}
            errorMessage={"A data fim do último atendimento é inválida"}
            value={enteredLastServiceDateEnd}
            onChangeHandler={enteredLastServiceDateEndChangedHandler}
            onBlurHandler={enteredLastServiceDateEndBlurHandler}
          />
          <div className={classes.extra_filters_modal_actions}>
            <Button
              style={ButtonStyle.NEUTRAL_SMALL}
              onClickHandler={() =>
                enteredLastServiceDateStartIsValid &&
                enteredLastServiceDateEndIsValid
                  ? setLastServiceDateModalIsOpen(false)
                  : setLastServiceDateModalIsOpen(true)
              }
            >
              Cancelar
            </Button>
            <Button
              style={ButtonStyle.PRIMARY_BODERED_SMALL}
              onClickHandler={() => {
                resetenteredLastServiceDateStartTextInput();
                resetenteredLastServiceDateEndTextInput();
              }}
            >
              Limpar
            </Button>
            <Button
              style={ButtonStyle.SUCCESS_BORDERED_SMALL}
              onClickHandler={() =>
                enteredLastServiceDateStartIsValid &&
                enteredLastServiceDateEndIsValid
                  ? setLastServiceDateModalIsOpen(false)
                  : setLastServiceDateModalIsOpen(true)
              }
            >
              Ok
            </Button>
          </div>
        </Modal>
      )}

      {lastServiceTypeModalIsOpen && (
        <Modal
          onClose={() => setLastServiceTypeModalIsOpen(false)}
          title="Tipo(s) de Atendimento(s)"
        >
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
          <div className={classes.extra_filters_modal_actions}>
            <Button
              style={ButtonStyle.NEUTRAL_SMALL}
              onClickHandler={() => setLastServiceTypeModalIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              style={ButtonStyle.PRIMARY_BODERED_SMALL}
              onClickHandler={() => {}}
            >
              Limpar
            </Button>
            <Button
              style={ButtonStyle.SUCCESS_BORDERED_SMALL}
              onClickHandler={() => setLastServiceTypeModalIsOpen(false)}
            >
              Ok
            </Button>
          </div>
        </Modal>
      )}

      {createCustomerModalIsOpen && (
        <Modal
          onClose={() => setCreateCustomerModalIsOpen(false)}
          title="Novo Cliente"
          theme={ModalTheme.SECONDARY}
        >
          <CreateCustomerModalContent />
        </Modal>
      )}
    </>
  );
};

export default Filter;
