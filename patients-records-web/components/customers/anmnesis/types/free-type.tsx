/** @format */

import { ItemAnamnesis } from "@/components/ui/dropdown-anamnesis-type";
import { Item } from "@/components/ui/dropdown-service-type";
import TextArea from "@/components/ui/textarea";
import { FileCustom } from "@/hooks/use-file-input";
import useInput from "@/hooks/use-input";
import { isNotEmpty } from "@/util/field-validations";
import { useEffect } from "react";

type Props = {
  anamnesisTypeId: string;
  anamnesisTypeDescription: string;
  selectedTypes: Item | Item[] | ItemAnamnesis[] | undefined;
  setTypes: any;
  anamnesisTypeContent?: string | null | FileCustom[];
  anamnesisTypeContentIsValid?: boolean | string;
  template?: string;
};

const AnamnesisFreeTypeForm = ({
  anamnesisTypeId,
  anamnesisTypeDescription,
  selectedTypes,
  setTypes,
  template,
  anamnesisTypeContent,
  anamnesisTypeContentIsValid,
}: Props) => {
  const {
    value: anamnesisFreeTypeText,
    isValid: anamnesisFreeTypeTextIsValid,
    hasError: anamnesisFreeTypeTextInputHasError,
    valueChangeHandler: anamnesisFreeTypeTextChangedHandler,
    inputBlurHandler: anamnesisFreeTypeTextBlurHandler,
    reset: resetAnamnesisFreeTypeTextInput,
    setEnteredValue: setTemplate,
  } = useInput({ validateValue: isNotEmpty });

  useEffect(() => {
    template && setTemplate(template);
  }, [template]);

  useEffect(() => {
    if (selectedTypes) {
      const newSelectedTypes = [...(selectedTypes as ItemAnamnesis[])];
      const targetType = newSelectedTypes.filter(
        (type) => type.id === anamnesisTypeId
      );
      if (targetType && targetType.length === 1) {
        targetType[0].anamnesisTypeContentIsValid =
          anamnesisFreeTypeTextIsValid;
        targetType[0].anamnesisTypeContent = anamnesisFreeTypeText;
        setTypes(newSelectedTypes);
      }
    }
  }, [anamnesisFreeTypeText]);

  anamnesisTypeContentIsValid = anamnesisFreeTypeTextIsValid;

  return (
    <>
      <TextArea
        label={anamnesisTypeDescription}
        id={`${anamnesisTypeDescription}`}
        hasError={anamnesisFreeTypeTextInputHasError}
        errorMessage={"O conteúdo da anamnese é inválido"}
        rows={20}
        required={false}
        value={anamnesisFreeTypeText}
        onChangeHandler={anamnesisFreeTypeTextChangedHandler}
        onBlurHandler={anamnesisFreeTypeTextBlurHandler}
      />
    </>
  );
};

export default AnamnesisFreeTypeForm;
