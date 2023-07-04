/** @format */

import Modal from "@/components/ui/modal";
import Collapsable from "@/components/ui/collapsable";
import classes from "@/styles/InformacoesAdicionais.module.css";

import Image from "next/image";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import PlansInfo from "@/components/aditional-info/plansInfo";
import Input, { InputType } from "@/components/ui/input";
import Button, { ButtonStyle } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useInput from "@/hooks/use-input";
import {
  isNotEmpty,
  validateCPF,
  validateCEP,
  validateIfExistsCNPJ,
} from "@/util/field-validations";
import {
  maskCEP,
  maskCNPJ,
  maskCPF,
  maskCreditCardNumber,
  maskDate,
} from "@/util/mask-functions";
import { getCepInfo } from "@/api/postalService";
import { PostalServiceResponse } from "@/models/postal-service/PostalServiceResponse";
import { NotificationContext } from "@/store/notification-context";
import { AditionalInfoRequest } from "@/models/users/AditionalInfoRequest";
import { updateUserAditionalInfo } from "@/api/userSettingsApi";
import { AditionalInfoResponse } from "@/models/users/AditionalInfoResponse";
import LoadingSpinner from "@/components/ui/loading-spinner";

enum PAYMENT_METHOD {
  CREDIT_CARD,
  BANK_SLIP,
  PIX,
  FREE,
}

const InformacoesAdicionais = () => {
  const route = useRouter();
  const { data: session, status, update } = useSession();
  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

  if (status === "unauthenticated") {
    route && route.replace("/entrar");
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(userCustom?.userPlanId);
  const [planId, setPlanId] = useState<string>(userCustom?.userPlanId ?? "2");
  const [plansInfoModalIsOpen, setPlansInfoModalIsOpen] =
    useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PAYMENT_METHOD>(
    PAYMENT_METHOD.CREDIT_CARD
  );
  const [step, setStep] = useState<number>(1);

  const [isAtPlanChooseStep, setIsAtPlanChooseStep] = useState<boolean>(true);
  const refChevronPlanArea = useRef<HTMLButtonElement>(null);

  const [isAtCompanyInfoStep, setIsAtCompanyInfoStep] =
    useState<boolean>(false);
  const refChevronCompanyArea = useRef<HTMLButtonElement>(null);

  const [isAtAboutYouStep, setIsAtAboutYouStep] = useState<boolean>(false);
  const refChevronAboutYouArea = useRef<HTMLButtonElement>(null);

  const [isAtPaymentStep, setIsAtPaymentStep] = useState<boolean>(false);
  const refChevronPaymentArea = useRef<HTMLButtonElement>(null);

  const {
    value: enteredCompanyName,
    isValid: enteredCompanyNameIsValid,
    hasError: enteredCompanyNameInputHasError,
    valueChangeHandler: enteredCompanyNameChangedHandler,
    inputBlurHandler: enteredCompanyNameBlurHandler,
    reset: resetCompanyNameInput,
    setEnteredValue: setCompanyName,
  } = useInput({
    validateValue: () => true,
  });

  const {
    value: enteredCNPJ,
    isValid: enteredCNPJIsValid,
    hasError: enteredCNPJInputHasError,
    valueChangeHandler: enteredCNPJChangeHandler,
    inputBlurHandler: enteredCNPJBlurHandler,
    reset: resetCNPJInput,
    setEnteredValue: setCNPJ,
  } = useInput({
    validateValue: validateIfExistsCNPJ,
    maskFunction: maskCNPJ,
  });

  const {
    value: enteredNumberOfEmployees,
    isValid: enteredNumberOfEmployeesIsValid,
    hasError: enteredNumberOfEmployeesInputHasError,
    valueChangeHandler: enteredNumberOfEmployeesChangeHandler,
    inputBlurHandler: enteredNumberOfEmployeesBlurHandler,
    reset: resetNumberOfEmployeesInput,
  } = useInput({
    validateValue: () => true,
  });

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: enteredNameInputHasError,
    valueChangeHandler: enteredNameChangeHandler,
    inputBlurHandler: enteredNameBlurHandler,
    reset: resetNameInput,
  } = useInput({
    validateValue: isNotEmpty,
  });

  const {
    value: enteredCPF,
    isValid: enteredCPFIsValid,
    hasError: enteredCPFInputHasError,
    valueChangeHandler: enteredCPFChangeHandler,
    inputBlurHandler: enteredCPFBlurHandler,
    reset: resetCPFInput,
  } = useInput({
    validateValue: validateCPF,
    maskFunction: maskCPF,
  });

  const {
    value: enteredCEP,
    isValid: enteredCEPIsValid,
    hasError: enteredCEPInputHasError,
    valueChangeHandler: enteredCEPChangeHandler,
    inputBlurHandler: enteredCEPBlurHandler,
    reset: resetCEPInput,
  } = useInput({
    validateValue: validateCEP,
    maskFunction: maskCEP,
  });

  const {
    value: enteredStreet,
    isValid: enteredStreetIsValid,
    hasError: enteredStreetInputHasError,
    valueChangeHandler: enteredStreetChangeHandler,
    inputBlurHandler: enteredStreetBlurHandler,
    reset: resetStreetInput,
    setEnteredValue: setEnteredStreet,
  } = useInput({
    validateValue: isNotEmpty,
  });

  const {
    value: enteredAddressNumber,
    isValid: enteredAddressNumberIsValid,
    hasError: enteredAddressNumberInputHasError,
    valueChangeHandler: enteredAddressNumberChangeHandler,
    inputBlurHandler: enteredAddressNumberBlurHandler,
    reset: resetAddressNumberInput,
  } = useInput({
    validateValue: isNotEmpty,
  });

  const {
    value: enteredDistrict,
    isValid: enteredDistrictIsValid,
    hasError: enteredDistrictInputHasError,
    valueChangeHandler: enteredDistrictChangeHandler,
    inputBlurHandler: enteredDistrictBlurHandler,
    reset: resetDistrictInput,
    setEnteredValue: setEnteredDistrict,
  } = useInput({
    validateValue: isNotEmpty,
  });

  const {
    value: enteredCity,
    isValid: enteredCityIsValid,
    hasError: enteredCityInputHasError,
    valueChangeHandler: enteredCityChangeHandler,
    inputBlurHandler: enteredCityBlurHandler,
    reset: resetCityInput,
    setEnteredValue: setEnteredCity,
  } = useInput({
    validateValue: isNotEmpty,
  });

  const {
    value: enteredAddressComplement,
    isValid: enteredAddressComplementIsValid,
    hasError: enteredAddressComplementInputHasError,
    valueChangeHandler: enteredAddressComplementChangeHandler,
    inputBlurHandler: enteredAddressComplementBlurHandler,
    reset: resetAddressComplementInput,
  } = useInput({
    validateValue: () => true,
  });

  const {
    value: enteredState,
    isValid: enteredStateIsValid,
    hasError: enteredStateInputHasError,
    valueChangeHandler: enteredStateChangeHandler,
    inputBlurHandler: enteredStateBlurHandler,
    reset: resetStateInput,
    setEnteredValue: setEnteredState,
  } = useInput({
    validateValue: () => true,
  });

  const {
    value: enteredCreditCardNumber,
    isValid: enteredCreditCardNumberIsValid,
    hasError: enteredCreditCardNumberInputHasError,
    valueChangeHandler: enteredCreditCardNumberChangeHandler,
    inputBlurHandler: enteredCreditCardNumberBlurHandler,
    reset: resetCreditCardNumberInput,
  } = useInput({
    validateValue: () => true,
    maskFunction: maskCreditCardNumber,
  });

  const {
    value: enteredCreditCardExpireDate,
    isValid: enteredCreditCardExpireDateIsValid,
    hasError: enteredCreditCardExpireDateInputHasError,
    valueChangeHandler: enteredCreditCardExpireDateChangeHandler,
    inputBlurHandler: enteredCreditCardExpireDateBlurHandler,
    reset: resetCreditCardExpireDateInput,
  } = useInput({
    validateValue: () => true,
    maskFunction: maskDate,
  });

  const {
    value: enteredCreditCardCVV,
    isValid: enteredCreditCardCVVIsValid,
    hasError: enteredCreditCardCVVInputHasError,
    valueChangeHandler: enteredCreditCardCVVChangeHandler,
    inputBlurHandler: enteredCreditCardCVVBlurHandler,
    reset: resetCreditCardCVVInput,
  } = useInput({
    validateValue: () => true,
  });

  useLayoutEffect(() => {
    setCompanyName((session?.user as any)?.companyName);
    (session?.user as any)?.userPlanId &&
      setPlanId((session?.user as any).userPlanId);
  }, [session?.user]);

  useEffect(() => {
    if (step === 1) {
      setIsAtPlanChooseStep(true);
      refChevronPlanArea?.current?.click();
      refChevronPlanArea?.current?.focus();
    } else if (step === 2) {
      setIsAtCompanyInfoStep(true);
      refChevronCompanyArea?.current?.click();
      refChevronCompanyArea?.current?.focus();
    } else if (step === 3) {
      setIsAtAboutYouStep(true);
      refChevronAboutYouArea?.current?.click();
      refChevronAboutYouArea?.current?.focus();
    } else if (step === 4) {
      setIsAtPaymentStep(true);
      refChevronPaymentArea?.current?.click();
      refChevronPaymentArea?.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (enteredCEPIsValid) {
      setIsLoading(true);
      const getAddressInfoByCEP = async () => {
        const postalServiceReponse = await getCepInfo(enteredCEP);
        if (postalServiceReponse.ok) {
          const address = postalServiceReponse.body as PostalServiceResponse;
          setEnteredStreet(address.logradouro!);
          setEnteredDistrict(address.bairro!);
          setEnteredCity(address.localidade!);
          setEnteredState(address.uf!);
        } else {
          const notification = {
            status: "error",
            title: "Erro ao buscar o CEP",
            message: "Insira os campos do endereço manualmente!",
          };
          notificationCtx.showNotification(notification);
        }
        setIsLoading(false);
      };
      getAddressInfoByCEP();
    }
  }, [enteredCEP, enteredCEPIsValid]);

  const handleChangeStep = (nextStep: number) => {
    setStep((prevStep) => {
      if (nextStep < 1 || nextStep > 4) {
        return prevStep;
      } else {
        if (step === 4 && planId === "1") {
          setIsAtPaymentStep(false);
        }
        return nextStep;
      }
    });
  };

  const onChangePaymentMethod = (event: any) => {
    setPaymentMethod(event.target.value * 1);
  };

  const formIsValid =
    isNotEmpty(planId) &&
    planId === "1" &&
    enteredCompanyNameIsValid &&
    enteredCNPJIsValid &&
    enteredNumberOfEmployeesIsValid &&
    enteredNameIsValid &&
    enteredCPFIsValid &&
    enteredCEPIsValid &&
    enteredStreetIsValid &&
    enteredAddressNumberIsValid &&
    enteredDistrictIsValid &&
    enteredCityIsValid &&
    enteredAddressComplement &&
    enteredStateIsValid;

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    if (!formIsValid) return;

    setIsLoading(true);

    const request = new AditionalInfoRequest(
      planId,
      enteredName,
      enteredCPF,
      enteredCEP,
      enteredStreet,
      enteredDistrict,
      enteredCity,
      enteredAddressComplement,
      enteredState,
      enteredCompanyName,
      enteredCNPJ,
      enteredNumberOfEmployees
    );

    const response = await updateUserAditionalInfo(
      userCustom.accessToken,
      request
    );

    if (response.ok) {
      const aditionalInfoResponse = response.body as AditionalInfoResponse;
      if (aditionalInfoResponse.userCreationCompleted) {
        await update({ userCreationCompleted: true });
        resetNameInput();
        resetCPFInput();
        resetCEPInput();
        resetStreetInput();
        resetDistrictInput();
        resetDistrictInput();
        resetCityInput();
        resetAddressComplementInput();
        resetStateInput();
        resetCompanyNameInput();
        resetCNPJInput();
        resetNumberOfEmployeesInput();
        const notification = {
          status: "success",
          title: "Sucesso",
          message:
            "Você já pode acessar a maior plataforma de apoio ao empreendedor na área de beleza do Brasil!",
        };
        notificationCtx.showNotification(notification);
        route.replace("/agenda");
      }
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
      {plansInfoModalIsOpen && (
        <Modal onClose={() => setPlansInfoModalIsOpen(false)} title="Planos">
          <PlansInfo />
        </Modal>
      )}
      <form
        id="payment-form"
        onSubmit={onSubmitHandler}
        className={classes.content}
      >
        <div className={classes.content_left}>
          <section className={classes.plan_choice_area}>
            <Collapsable
              open={isAtPlanChooseStep}
              title={<p className={classes.title}>1 - Escolha Seu Plano</p>}
              chevronRef={refChevronPlanArea}
            >
              <div className={classes.plans}>
                <div
                  onClick={() => {
                    setPlanId("1");
                  }}
                  className={`${classes.plan_square} ${
                    planId === "1" ? classes.chosen_plan : ""
                  }`}
                >
                  <p className={classes.plan_title}>Grátis</p>
                  <p className={classes.plan_price}>
                    0 R$ <span className={classes.per_month}>/ Mês</span>
                  </p>
                  <div className={classes.detail_area}>
                    <div>
                      <p className={classes.plan_details}>Detalhes</p>
                    </div>
                    <div
                      onClick={() => {
                        setPlansInfoModalIsOpen(true);
                      }}
                    >
                      <Image
                        src={`/images/info.svg`}
                        alt="Details Caret"
                        width={25}
                        height={25}
                      />
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setPlanId("2");
                  }}
                  className={`${classes.plan_square} ${
                    planId === "2" ? classes.chosen_plan : ""
                  }`}
                >
                  <p className={classes.plan_title}>Anual</p>
                  <p className={classes.plan_price}>
                    20 R$ <span className={classes.per_month}>/ Mês</span>
                  </p>
                  <div className={classes.detail_area}>
                    <div>
                      <p className={classes.plan_details}>Detalhes</p>
                    </div>
                    <div
                      onClick={() => {
                        setPlansInfoModalIsOpen(true);
                      }}
                    >
                      <Image
                        src={`/images/info.svg`}
                        alt="Details Caret"
                        width={25}
                        height={25}
                      />
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setPlanId("3");
                  }}
                  className={`${classes.plan_square} ${
                    planId === "3" ? classes.chosen_plan : ""
                  }`}
                >
                  <p className={classes.plan_title}>Mensal</p>
                  <p className={classes.plan_price}>
                    40 R$ <span className={classes.per_month}>/ Mês</span>
                  </p>
                  <div className={classes.detail_area}>
                    <div>
                      <p className={classes.plan_details}>Detalhes</p>
                    </div>
                    <div
                      onClick={() => {
                        setPlansInfoModalIsOpen(true);
                      }}
                    >
                      <Image
                        src={`/images/info.svg`}
                        alt="Details Caret"
                        width={25}
                        height={25}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Collapsable>
          </section>
          <section className={classes.actions}>
            <Button
              type="submit"
              style={ButtonStyle.SUCCESS}
              onClickHandler={() => {
                handleChangeStep(2);
              }}
            >
              Próximo
            </Button>
          </section>
          <section className={classes.about_your_business}>
            <Collapsable
              open={isAtCompanyInfoStep}
              title={<p className={classes.title}>2 - Dados do Seu Negócio</p>}
              chevronRef={refChevronCompanyArea}
            >
              <div>
                <Input
                  type={InputType.TEXT}
                  label={"Nome do seu Empreendimento"}
                  placeholder="Ex.: Salão da Ana"
                  id={"business-name"}
                  errorMessage="O nome do seu empreendimento está incorreto"
                  hasError={enteredCompanyNameInputHasError}
                  value={enteredCompanyName}
                  onChangeHandler={enteredCompanyNameChangedHandler}
                  onBlurHandler={enteredCompanyNameBlurHandler}
                />
              </div>
              <div className={classes.action_multiple_same_row}>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"CNPJ (Opcional)"}
                    placeholder="Ex.: 53.104.864/00..."
                    id={"business-cnpj"}
                    hasError={enteredCNPJInputHasError}
                    errorMessage="O CNPJ é inválido"
                    required={false}
                    value={enteredCNPJ}
                    onChangeHandler={enteredCNPJChangeHandler}
                    onBlurHandler={enteredCNPJBlurHandler}
                  />
                </div>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Nº de Colaboradores"}
                    placeholder="Ex.: 1"
                    id={"business-employee-number"}
                    errorMessage="A quantidade de funcionários é inválida"
                    hasError={enteredNumberOfEmployeesInputHasError}
                    required={false}
                    value={enteredNumberOfEmployees}
                    onChangeHandler={enteredNumberOfEmployeesChangeHandler}
                    onBlurHandler={enteredNumberOfEmployeesBlurHandler}
                  />
                </div>
              </div>
            </Collapsable>
          </section>
          <section className={classes.actions}>
            <Button
              type="submit"
              style={ButtonStyle.SUCCESS}
              onClickHandler={() => {
                handleChangeStep(3);
              }}
            >
              Próximo
            </Button>
          </section>
          <section className={classes.about_you}>
            <Collapsable
              open={isAtAboutYouStep}
              title={<p className={classes.title}>3 - Sobre Você</p>}
              chevronRef={refChevronAboutYouArea}
            >
              <div>
                <Input
                  type={InputType.TEXT}
                  label={"Nome Completo:"}
                  placeholder="Ex.: Ana Maria de Souza"
                  id={"name"}
                  errorMessage="O nome fornecido é inválido"
                  hasError={enteredNameInputHasError}
                  value={enteredName}
                  onChangeHandler={enteredNameChangeHandler}
                  onBlurHandler={enteredNameBlurHandler}
                />
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <Input
                  type={InputType.TEXT}
                  label={"CPF:"}
                  placeholder="Ex.: 123.456.789-00"
                  id={"cpf"}
                  errorMessage="O CPF fornecido é inválido"
                  hasError={enteredCPFInputHasError}
                  value={enteredCPF}
                  onChangeHandler={enteredCPFChangeHandler}
                  onBlurHandler={enteredCPFBlurHandler}
                />
              </div>
              <div className={classes.input_half_size}>
                <Input
                  type={InputType.TEXT}
                  label={"CEP de sua Residência:"}
                  placeholder="Ex.: 32044-200"
                  id={"cep"}
                  hasError={enteredCEPInputHasError}
                  errorMessage="O CEP fornecido é inválido"
                  value={enteredCEP}
                  onChangeHandler={enteredCEPChangeHandler}
                  onBlurHandler={enteredCEPBlurHandler}
                />
              </div>
              <div className={classes.action_multiple_same_row}>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Rua"}
                    placeholder="Ex.: Rua das Acácias"
                    id={"street"}
                    hasError={enteredStreetInputHasError}
                    errorMessage="O nome da rua é inválido"
                    value={enteredStreet}
                    onChangeHandler={enteredStreetChangeHandler}
                    onBlurHandler={enteredStreetBlurHandler}
                  />
                </div>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Número"}
                    placeholder="Ex.: 123"
                    id={"address-number"}
                    hasError={enteredAddressNumberInputHasError}
                    errorMessage="O número do endereço é inválido"
                    value={enteredAddressNumber}
                    onChangeHandler={enteredAddressNumberChangeHandler}
                    onBlurHandler={enteredAddressNumberBlurHandler}
                  />
                </div>
              </div>
              <div className={classes.action_multiple_same_row}>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Bairro:"}
                    placeholder="Ex.: Floresta"
                    id={"address-district"}
                    errorMessage="O nome do bairro é inválido"
                    hasError={enteredDistrictInputHasError}
                    value={enteredDistrict}
                    onChangeHandler={enteredDistrictChangeHandler}
                    onBlurHandler={enteredDistrictBlurHandler}
                  />
                </div>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Cidade:"}
                    placeholder="Ex.: São Paulo"
                    id={"address-city"}
                    errorMessage="O nome da cidade é inválido"
                    hasError={enteredCityInputHasError}
                    value={enteredCity}
                    onChangeHandler={enteredCityChangeHandler}
                    onBlurHandler={enteredCityBlurHandler}
                  />
                </div>
              </div>
              <div className={classes.action_multiple_same_row}>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Complemento"}
                    placeholder="Ex.: apto 101"
                    id={"address-complement"}
                    errorMessage="O complemento do endereço é inválido"
                    hasError={enteredAddressComplementInputHasError}
                    value={enteredAddressComplement}
                    onChangeHandler={enteredAddressComplementChangeHandler}
                    onBlurHandler={enteredAddressComplementBlurHandler}
                  />
                </div>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Estado:"}
                    placeholder="Ex.: São Paulo"
                    id={"address-state"}
                    hasError={enteredStateInputHasError}
                    errorMessage="O nome do estado é inválido"
                    value={enteredState}
                    onChangeHandler={enteredStateChangeHandler}
                    onBlurHandler={enteredStateBlurHandler}
                  />
                </div>
              </div>
            </Collapsable>
          </section>
          <section className={classes.actions}>
            <Button
              type="button"
              style={ButtonStyle.SUCCESS}
              onClickHandler={() => {
                handleChangeStep(4);
              }}
            >
              Próximo
            </Button>
          </section>
        </div>
        <div className={classes.content_right}>
          <section className={classes.payment}>
            <Collapsable
              open={isAtPaymentStep}
              title={<p className={classes.title}>4 - Pagamento</p>}
              chevronRef={refChevronPaymentArea}
            >
              <div className={classes.payment_square}>
                {planId === "1" && (
                  <div
                    className={`${classes.credit_card} ${
                      paymentMethod === PAYMENT_METHOD.CREDIT_CARD &&
                      classes.selected_payment_method
                    }`}
                  >
                    <div className={classes.credit_card_line_one}>
                      <div className={classes.radio_button}>
                        <input
                          checked={true}
                          id="payment-method-credit-card"
                          type="radio"
                          name="payment-method"
                          value={PAYMENT_METHOD.FREE}
                        />
                        <p className={classes.payment_method_label}>
                          Plano Grátis
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {planId !== "1" && (
                  <>
                    <div
                      className={`${classes.credit_card} ${
                        paymentMethod === PAYMENT_METHOD.CREDIT_CARD &&
                        classes.selected_payment_method
                      }`}
                    >
                      <div className={classes.credit_card_line_one}>
                        <div className={classes.radio_button}>
                          <input
                            checked={
                              paymentMethod === PAYMENT_METHOD.CREDIT_CARD
                            }
                            id="payment-method-credit-card"
                            type="radio"
                            name="payment-method"
                            value={PAYMENT_METHOD.CREDIT_CARD}
                            onChange={onChangePaymentMethod}
                          />
                          <p className={classes.payment_method_label}>
                            Pague com Cartão de Crédito
                          </p>
                        </div>
                        <div className={classes.credit_card_brands}>
                          <Image
                            src={`/images/credit_card_mastercard.svg`}
                            alt="Details Caret"
                            width={35}
                            height={35}
                          />
                          <Image
                            src={`/images/credit_card_visa.svg`}
                            alt="Details Caret"
                            width={35}
                            height={35}
                          />
                        </div>
                      </div>
                      <div className={classes.credit_card_line_two}>
                        <div>
                          <Input
                            type={InputType.TEXT}
                            label={"Número do Cartão"}
                            labelStyle={{ color: "#171717" }}
                            placeholder="Ex.: 1234.5678.9012.3456"
                            id={"credit-card-number"}
                            hasError={enteredCreditCardNumberInputHasError}
                            errorMessage="O número do cartão de crédito fornecido é inválido"
                            value={enteredCreditCardNumber}
                            onChangeHandler={
                              enteredCreditCardNumberChangeHandler
                            }
                            onBlurHandler={enteredCreditCardNumberBlurHandler}
                          />
                        </div>
                        <div>
                          <Input
                            type={InputType.TEXT}
                            label={"Data de Expiração"}
                            labelStyle={{ color: "#171717" }}
                            placeholder="Ex.: 01/01/2029"
                            id={"credit-card-expire-date"}
                            hasError={enteredCreditCardExpireDateInputHasError}
                            errorMessage="A data de expiração do cartão de crédito é inválida"
                            value={enteredCreditCardExpireDate}
                            onChangeHandler={
                              enteredCreditCardExpireDateChangeHandler
                            }
                            onBlurHandler={
                              enteredCreditCardExpireDateBlurHandler
                            }
                          />
                        </div>
                      </div>
                      <div className={classes.credit_card_line_three}>
                        <div className={classes.credit_card_cvv_container}>
                          <div>
                            <Input
                              type={InputType.TEXT}
                              label={"Código de Segurança"}
                              labelStyle={{ color: "#171717" }}
                              inputStyle={{ maxWidth: "5rem" }}
                              placeholder="Ex.: 123"
                              id={"credit-card-cvv"}
                              hasError={enteredCreditCardCVVInputHasError}
                              errorMessage="O código de segurança do cartão de crédito é inválido"
                              value={enteredCreditCardCVV}
                              onChangeHandler={
                                enteredCreditCardCVVChangeHandler
                              }
                              onBlurHandler={enteredCreditCardCVVBlurHandler}
                            />
                          </div>
                          <p
                            onClick={() => {
                              alert("CVV explicação");
                            }}
                            className={classes.cvv_explaination}
                          >
                            O que é isso?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${classes.bank_slip} ${
                        paymentMethod === PAYMENT_METHOD.BANK_SLIP &&
                        classes.selected_payment_method
                      }`}
                    >
                      <div className={classes.credit_card_line_one}>
                        <div className={classes.radio_button}>
                          <input
                            checked={paymentMethod === PAYMENT_METHOD.BANK_SLIP}
                            id="payment-method-bank-slip"
                            type="radio"
                            name="payment-method"
                            value={PAYMENT_METHOD.BANK_SLIP}
                            onChange={onChangePaymentMethod}
                          />
                          <p className={classes.payment_method_label}>
                            Pague com Boleto
                          </p>
                        </div>
                        <div className={classes.credit_card_brands}>
                          <Image
                            src={`/images/barcode.svg`}
                            alt="Details Caret"
                            width={35}
                            height={35}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${classes.pix} ${
                        paymentMethod === PAYMENT_METHOD.PIX &&
                        classes.selected_payment_method
                      }`}
                    >
                      <div className={classes.credit_card_line_one}>
                        <div className={classes.radio_button}>
                          <input
                            checked={paymentMethod === PAYMENT_METHOD.PIX}
                            id="payment-method-pix"
                            type="radio"
                            name="payment-method"
                            value={PAYMENT_METHOD.PIX}
                            onChange={onChangePaymentMethod}
                          />
                          <p className={classes.payment_method_label}>
                            Pague com PIX
                          </p>
                        </div>
                        <div className={classes.credit_card_brands}>
                          <Image
                            src={`/images/pix.svg`}
                            alt="Details Caret"
                            width={35}
                            height={35}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className={classes.security_area}>
                  <Image
                    src={`/images/locker.svg`}
                    alt="Locker specifing a secure area for payments"
                    width={35}
                    height={35}
                  />
                  <p>
                    Nós protegemos suas informações de pagamento usando
                    criptografia de ponta a ponta
                  </p>
                </div>
              </div>
            </Collapsable>
          </section>
          <section className={classes.actions}>
            <Button
              type="submit"
              style={ButtonStyle.SUCCESS}
              disabled={!formIsValid}
            >
              Confirmar
            </Button>
          </section>
        </div>
      </form>
    </>
  );
};

export default InformacoesAdicionais;
