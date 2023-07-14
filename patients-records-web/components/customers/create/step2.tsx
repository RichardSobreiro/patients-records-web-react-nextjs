/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./step2.module.css";
import Dropdown, { Item } from "@/components/ui/dropdown";
import TextArea from "@/components/ui/textarea";

type Props = {
  enteredBirthdate: string;
  birthdateInputHasError: boolean;
  birthdateChangedHandler: (event: any) => void;
  birthdateBlurHandler: (event: any) => void;

  selectedGender: Item | undefined;
  selectedGenderInputHasError: boolean;
  selectedGenderChangeHandler: (selectedItem: Item | undefined) => void;
  selectedGenderBlurHandler: () => void;

  selectedEthnicity: Item | undefined;
  selectedEthnicityInputHasError: boolean;
  selectedEthnicityChangeHandler: (selectedItem: Item | undefined) => void;
  selectedEthnicityBlurHandler: () => void;

  selectedMaritalStatus: Item | undefined;
  selectedMaritalStatusInputHasError: boolean;
  selectedMaritalStatusChangeHandler: (selectedItem: Item | undefined) => void;
  selectedMaritalStatusBlurHandler: () => void;

  selectedEmploymentStatus: Item | undefined;
  selectedEmploymentStatusInputHasError: boolean;
  selectedEmploymentStatusChangeHandler: (
    selectedItem: Item | undefined
  ) => void;
  selectedEmploymentStatusBlurHandler: () => void;

  enteredComments: string | undefined;
  enteredCommentsInputHasError: boolean;
  enteredCommentsChangedHandler: (event: any) => void;
  enteredCommentsBlurHandler: (event: any) => void;
};

const Step2 = (props: Props) => {
  return (
    <section className={classes.container}>
      <h1 className={classes.title}>Anamnese</h1>
      <div className={classes.action_group}>
        <div>
          <Input
            type={InputType.DATE}
            label={"Data de Aniversário"}
            id={"customer-birthdate"}
            hasError={props.birthdateInputHasError}
            errorMessage={"A data de aniversário do cliente é inválida"}
            value={props.enteredBirthdate}
            onChangeHandler={props.birthdateChangedHandler}
            onBlurHandler={props.birthdateBlurHandler}
          />
        </div>
        <div>
          <Dropdown
            label={"Sexo"}
            list={[
              { id: 1, description: "Feminino" },
              { id: 2, description: "Masculino" },
              { id: 3, description: "Outros" },
            ]}
            idPropertyName={"id"}
            descriptionPropertyName="description"
            id={"gender"}
            hasError={props.selectedGenderInputHasError}
            errorMessage={""}
            value={props.selectedGender}
            onChangeHandler={props.selectedGenderChangeHandler}
            onBlurHandler={props.selectedGenderBlurHandler}
          />
        </div>
      </div>
      <div className={classes.action_group}>
        <div>
          <Dropdown
            label={"Cor/Etnia"}
            list={[
              { id: 1, description: "Preta" },
              { id: 2, description: "Branca" },
              { id: 3, description: "Parda" },
              { id: 4, description: "Indígena" },
              { id: 5, description: "Amarela" },
            ]}
            idPropertyName={"id"}
            descriptionPropertyName="description"
            id={"ethnicity"}
            hasError={props.selectedEthnicityInputHasError}
            errorMessage={""}
            value={props.selectedEthnicity}
            onChangeHandler={props.selectedEthnicityChangeHandler}
            onBlurHandler={props.selectedEthnicityBlurHandler}
          />
        </div>
        <div>
          <Dropdown
            label={"Estado Civil"}
            list={[
              { id: 1, description: "Solteiro" },
              { id: 2, description: "Casado" },
              { id: 3, description: "Separado" },
              { id: 4, description: "Divorciado" },
              { id: 5, description: "Viúvo" },
            ]}
            idPropertyName={"id"}
            descriptionPropertyName="description"
            id={"marital-status"}
            hasError={props.selectedMaritalStatusInputHasError}
            errorMessage={""}
            value={props.selectedMaritalStatus}
            onChangeHandler={props.selectedMaritalStatusChangeHandler}
            onBlurHandler={props.selectedMaritalStatusBlurHandler}
          />
        </div>
        <div>
          <Dropdown
            label={"Ocupação"}
            list={[
              { id: 1, description: "Empregado" },
              { id: 2, description: "Desempregado" },
              { id: 3, description: "Autônomo" },
              { id: 4, description: "Empresário" },
              { id: 5, description: "Aposentado" },
            ]}
            idPropertyName={"id"}
            descriptionPropertyName="description"
            id={"employment"}
            hasError={props.selectedEmploymentStatusInputHasError}
            errorMessage={""}
            value={props.selectedEmploymentStatus}
            onChangeHandler={props.selectedEmploymentStatusChangeHandler}
            onBlurHandler={props.selectedEmploymentStatusBlurHandler}
          />
        </div>
      </div>
      <div className={classes.action_group}>
        <div>
          <TextArea
            label={"Comentários"}
            id={"comments"}
            hasError={props.enteredCommentsInputHasError}
            errorMessage="O comentário é obrigatório."
            rows={5}
            required={false}
            value={props.enteredComments}
            onChangeHandler={props.enteredCommentsChangedHandler}
            onBlurHandler={props.enteredCommentsBlurHandler}
          />
        </div>
      </div>
    </section>
  );
};

export default Step2;
