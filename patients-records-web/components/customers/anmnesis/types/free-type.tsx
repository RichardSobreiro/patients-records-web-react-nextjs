/** @format */

import TextArea from "@/components/ui/textarea";

type Props = {
  anamnesisFreeTypeText: string;
  anamnesisFreeTypeTextInputHasError: boolean;
  anamnesisFreeTypeTextChangedHandler: (event: any) => void;
  anamnesisFreeTypeTextBlurHandler: (event: any) => void;
};

const AnamnesisFreeTypeForm = (props: Props) => {
  return (
    <>
      <TextArea
        label={""}
        id={"anamnesis-free-type-form-textarea"}
        hasError={props.anamnesisFreeTypeTextInputHasError}
        errorMessage={"O conteúdo da anamnese é inválido"}
        rows={20}
        required={false}
        value={props.anamnesisFreeTypeText}
        onChangeHandler={props.anamnesisFreeTypeTextChangedHandler}
        onBlurHandler={props.anamnesisFreeTypeTextBlurHandler}
      />
    </>
  );
};

export default AnamnesisFreeTypeForm;
