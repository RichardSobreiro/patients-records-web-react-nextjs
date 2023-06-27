/** @format */

import Modal from "@/components/ui/modal";
import Collapsable from "@/components/ui/collapsable";
import classes from "@/styles/InformacoesAdicionais.module.css";

import Image from "next/image";
import { useState } from "react";
import PlansInfo from "@/components/aditional-info/plansInfo";
import Input, { InputType } from "@/components/ui/input";
import Button, { ButtonStyle } from "@/components/ui/button";

enum PAYMENT_METHOD {
  CREDIT_CARD,
  BANK_SLIP,
  PIX,
}

const InformacoesAdicionais = () => {
  const [planId, setPlanId] = useState<number>(2);
  const [plansInfoModalIsOpen, setPlansInfoModalIsOpen] =
    useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PAYMENT_METHOD>(
    PAYMENT_METHOD.CREDIT_CARD
  );

  const onChangePaymentMethod = (event: any) => {
    setPaymentMethod(event.target.value * 1);
  };

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
  };

  return (
    <>
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
              open={true}
              title={<p className={classes.title}>1 - Escolha Seu Plano</p>}
            >
              <div className={classes.plans}>
                <div
                  onClick={() => {
                    setPlanId(1);
                  }}
                  className={`${classes.plan_square} ${
                    planId === 1 ? classes.chosen_plan : ""
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
                    setPlanId(2);
                  }}
                  className={`${classes.plan_square} ${
                    planId === 2 ? classes.chosen_plan : ""
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
                    setPlanId(3);
                  }}
                  className={`${classes.plan_square} ${
                    planId === 3 ? classes.chosen_plan : ""
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
          <section className={classes.about_your_business}>
            <Collapsable
              open={false}
              title={<p className={classes.title}>2 - Dados do Seu Negócio</p>}
            >
              <div>
                <Input
                  type={InputType.TEXT}
                  label={"Nome do seu Empreendimento"}
                  placeholder="Ex.: Salão da Ana"
                  id={"business-name"}
                  required={true}
                />
              </div>
              <div className={classes.action_multiple_same_row}>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"CNPJ (Opcional)"}
                    placeholder="Ex.: 53.104.864/00..."
                    id={"business-cnpj"}
                    required={false}
                  />
                </div>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Nº de Colaboradores"}
                    placeholder="Ex.: 1"
                    id={"business-employee-number"}
                    required={false}
                  />
                </div>
              </div>
            </Collapsable>
          </section>
          <section className={classes.about_you}>
            <Collapsable
              open={false}
              title={<p className={classes.title}>3 - Sobre Você</p>}
            >
              <div>
                <Input
                  type={InputType.TEXT}
                  label={"Nome Completo:"}
                  placeholder="Ex.: Ana Maria de Souza"
                  id={"name"}
                  required={true}
                />
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <Input
                  type={InputType.TEXT}
                  label={"CPF:"}
                  placeholder="Ex.: 123.456.789-00"
                  id={"cpf"}
                  required={true}
                />
              </div>
              <div className={classes.input_half_size}>
                <Input
                  type={InputType.TEXT}
                  label={"Cep de sua Residência:"}
                  placeholder="Ex.: 32044-200"
                  id={"cep"}
                  required={true}
                />
              </div>
              <div className={classes.action_multiple_same_row}>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Rua"}
                    placeholder="Ex.: Rua das Acácias"
                    id={"street"}
                    required={true}
                  />
                </div>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Número"}
                    placeholder="Ex.: 123"
                    id={"address-number"}
                    required={true}
                  />
                </div>
              </div>
              <div className={classes.input_half_size}>
                <Input
                  type={InputType.TEXT}
                  label={"Bairro:"}
                  placeholder="Ex.: Floresta"
                  id={"address-district"}
                  required={true}
                />
              </div>
              <div className={classes.action_multiple_same_row}>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Complemento"}
                    placeholder="Ex.: apto 101"
                    id={"address-complement"}
                    required={false}
                  />
                </div>
                <div>
                  <Input
                    type={InputType.TEXT}
                    label={"Estado:"}
                    placeholder="Ex.: São Paulo"
                    id={"address-state"}
                    required={true}
                  />
                </div>
              </div>
            </Collapsable>
          </section>
        </div>
        <div className={classes.content_right}>
          <section className={classes.payment}>
            <Collapsable
              open={false}
              title={<p className={classes.title}>4 - Pagamento</p>}
            >
              <div className={classes.payment_square}>
                <div
                  className={`${classes.credit_card} ${
                    paymentMethod === PAYMENT_METHOD.CREDIT_CARD &&
                    classes.selected_payment_method
                  }`}
                >
                  <div className={classes.credit_card_line_one}>
                    <div className={classes.radio_button}>
                      <input
                        checked={paymentMethod === PAYMENT_METHOD.CREDIT_CARD}
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
                        required={true}
                      />
                    </div>
                    <div>
                      <Input
                        type={InputType.TEXT}
                        label={"Data de Expiração"}
                        labelStyle={{ color: "#171717" }}
                        placeholder="Ex.: 01/01/2029"
                        id={"credit-card-expire-date"}
                        required={true}
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
                          required={true}
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
            <Button type="submit" style={ButtonStyle.SUCCESS}>
              Confirmar
            </Button>
          </section>
        </div>
      </form>
    </>
  );
};

export default InformacoesAdicionais;
