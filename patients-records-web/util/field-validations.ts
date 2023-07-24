/** @format */

import { Item } from "@/components/ui/dropdown";

export const isDate = (date: string): boolean =>
  (new Date(date) as unknown as string) !== "Invalid Date" &&
  !isNaN(new Date(date) as unknown as number);

export const isNotEmpty = (value: any) => value.trim() !== "";

export const ifExistsMustBeGreatherThanThree = (value?: any) =>
  value ? value.trim() !== "" && value.length > 3 : true;

export const isEmail = (value: any) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const ifEnteredMustBeEmail = (value?: any) => {
  if (value) {
    return isEmail(value);
  } else {
    return true;
  }
};

export const isPassword = (value: any) => {
  if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const isPasswordConfirmation = (
  value: any,
  secondValueValidationFunction?: string
) => {
  let returnValue: boolean | string = false;
  if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)) {
    returnValue = true;
  } else {
    return "Senha Inválida!";
  }

  if (value === secondValueValidationFunction) {
    returnValue = true;
  } else {
    returnValue =
      "A senha de confirmação difere da senha fornecida no campo acima";
  }
  return returnValue;
};

export const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj == "") return false;

  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != +digitos.charAt(0) * 1) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != +digitos.charAt(1) * 1) return false;

  return true;
};

export const validateIfExistsCNPJ = (cnpj?: string): boolean => {
  if (cnpj) {
    return validateCNPJ(cnpj);
  } else {
    return true;
  }
};

export const validateCPF = (strCPF: string) => {
  strCPF = strCPF.replace(/[^\d]+/g, "");

  let Soma;
  let Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (let i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
};

export const validateMobilePhoneNumber = (strMobilePhoneNumber: string) => {
  strMobilePhoneNumber = strMobilePhoneNumber.replace(/[^\d]+/g, "");
  return /^([14689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/.test(
    strMobilePhoneNumber
  );
};

export const validateIfExistsCPF = (strCPF?: string) => {
  if (strCPF) {
    return validateCPF(strCPF);
  } else {
    return true;
  }
};

export const validateCEP = (strCEP: string): boolean => {
  // Caso o CEP não esteja nesse formato ele é inválido!
  var objER = /^[0-9]{2}[0-9]{3}-[0-9]{3}$/;

  strCEP = strCEP.trim();
  if (strCEP.length > 0) {
    if (objER.test(strCEP)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const atLeastOneSelected = (input?: Item) => {
  if (!input) {
    return false;
  } else {
    return true;
  }
};

export const atLeastOneSelectedArray = (input?: Item | Item[]) => {
  if (!Array.isArray(input)) return false;
  const selected = input?.filter((item) => item.selected);
  if (!input || !selected || selected.length === 0) {
    return false;
  } else {
    return true;
  }
};
