/** @format */

import useInput from "@/hooks/use-input";
import classes from "@/styles/customers/Editar.module.css";
import { isNotEmpty } from "@/util/field-validations";

import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useDropdown from "@/hooks/use-dropdown";
import Head from "next/head";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSession } from "next-auth/react";
import { NotificationContext } from "@/store/notification-context";
import { GetCustomerByIdResponse } from "@/models/customers/GetCustomerByIdResponse";
import PersonalInfo from "@/components/customers/edit/personal-info";
import AnamnesisList from "@/components/customers/anmnesis/anamnesis-list";
import ServicesList from "@/components/customers/services/services-list";

const EditarCliente = () => {
  const [toggleTab, setToggleTab] = useState<boolean>(true);
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [customer, setCustomer] = useState<GetCustomerByIdResponse>();

  if (status === "unauthenticated") {
    router && router.replace("/entrar");
  }

  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    value: enteredBirthdate,
    isValid: enteredBirthdateIsValid,
    hasError: birthdateInputHasError,
    valueChangeHandler: birthdateChangedHandler,
    inputBlurHandler: birthdateBlurHandler,
    reset: resetBirthdateInput,
    setEnteredValue: setBirthdate,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: selectedGender,
    isValid: selectedGenderIsValid,
    hasError: selectedGenderInputHasError,
    valueChangeHandler: selectedGenderChangeHandler,
    inputBlurHandler: selectedGenderBlurHandler,
    reset: resetSelectedGender,
    errorMessage: selectedGenderErrorMessage,
    setItem: selectedGenderSetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: selectedEthnicity,
    isValid: selectedEthnicityIsValid,
    hasError: selectedEthnicityInputHasError,
    valueChangeHandler: selectedEthnicityChangeHandler,
    inputBlurHandler: selectedEthnicityBlurHandler,
    reset: resetSelectedEthnicity,
    errorMessage: selectedEthnicityErrorMessage,
    setItem: selectedEthnicitySetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: selectedMaritalStatus,
    isValid: selectedMaritalStatusIsValid,
    hasError: selectedMaritalStatusInputHasError,
    valueChangeHandler: selectedMaritalStatusChangeHandler,
    inputBlurHandler: selectedMaritalStatusBlurHandler,
    reset: resetSelectedMaritalStatus,
    errorMessage: selectedMaritalStatusErrorMessage,
    setItem: selectedMaritalStatusSetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: selectedEmploymentStatus,
    isValid: selectedEmploymentStatusIsValid,
    hasError: selectedEmploymentStatusInputHasError,
    valueChangeHandler: selectedEmploymentStatusChangeHandler,
    inputBlurHandler: selectedEmploymentStatusBlurHandler,
    reset: resetSelectedEmploymentStatus,
    errorMessage: selectedEmploymentStatusErrorMessage,
    setItem: selectedEmploymentStatusSetItem,
  } = useDropdown({ validateValue: () => true });

  const {
    value: enteredComments,
    isValid: enteredCommentsIsValid,
    hasError: enteredCommentsInputHasError,
    valueChangeHandler: enteredCommentsChangedHandler,
    inputBlurHandler: enteredCommentsBlurHandler,
    reset: resetEnteredCommentsInput,
  } = useInput({ validateValue: () => true });

  return (
    <>
      <Head>
        <title>Editar Cliente</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading && <LoadingSpinner />}
      <div>
        <section>
          <PersonalInfo customerId={`${router.query.customerId}`} />
        </section>
        <section className={classes.lists_container}>
          <div className={classes.lists_container_tabs}>
            <div
              className={`${classes.lists_container_tabs_cell_anamneses} ${
                toggleTab ? classes.is_tab_active_anmnesis : ""
              }`}
              onClick={() => setToggleTab(true)}
            >
              Anamneses
            </div>
            <div
              className={`${classes.lists_container_tabs_cell_services} ${
                !toggleTab ? classes.is_tab_active_services : ""
              }`}
              onClick={() => setToggleTab(false)}
            >
              Atendimentos
            </div>
          </div>
          {toggleTab ? <AnamnesisList /> : <ServicesList />}
        </section>
      </div>
    </>
  );
};

export default EditarCliente;
