/** @format */

export const maskCreditCardNumber = (inputCard: string): string => {
  const cardValue = inputCard
    .replace(/\D/g, "")
    .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
  if (cardValue) {
    inputCard = !cardValue[2]
      ? cardValue[1]
      : `${cardValue[1]}-${cardValue[2]}${`${
          cardValue[3] ? `-${cardValue[3]}` : ""
        }`}${`${cardValue[4] ? `-${cardValue[4]}` : ""}`}`;
  }
  //const numbers = inputCard.replace(/(\D)/g, "");
  return inputCard;
};

export const maskCNPJ = (inputCard: string): string => {
  const cardValue = inputCard
    .replace(/\D/g, "")
    .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
  if (cardValue) {
    inputCard = !cardValue[2]
      ? cardValue[1]
      : `${cardValue[1]}.${cardValue[2]}${`${
          cardValue[3] ? `.${cardValue[3]}` : ""
        }`}${`${cardValue[4] ? `\\${cardValue[4]}` : ""}`}${`${
          cardValue[5] ? `-${cardValue[5]}` : ""
        }`}`;
  }
  return inputCard;
};

export const maskCPF = (inputCard: string): string => {
  const cardValue = inputCard
    .replace(/\D/g, "")
    .match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
  if (cardValue) {
    inputCard = !cardValue[2]
      ? cardValue[1]
      : `${cardValue[1]}.${cardValue[2]}${`${
          cardValue[3] ? `.${cardValue[3]}` : ""
        }`}${`${cardValue[4] ? `-${cardValue[4]}` : ""}`}`;
  }
  return inputCard;
};

export const maskCEP = (inputCard: string): string => {
  const cardValue = inputCard.replace(/\D/g, "").match(/(\d{0,5})(\d{0,3})/);
  if (cardValue) {
    inputCard = !cardValue[2]
      ? cardValue[1]
      : `${cardValue[1]}-${cardValue[2]}`;
  }
  return inputCard;
};

export const maskDate = (inputCard: string): string => {
  const cardValue = inputCard
    .replace(/\D/g, "")
    .match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
  if (cardValue) {
    inputCard = !cardValue[2]
      ? cardValue[1]
      : `${cardValue[1]}/${cardValue[2]}${`${
          cardValue[3] ? `/${cardValue[3]}` : ""
        }`}`;
  }
  return inputCard;
};
