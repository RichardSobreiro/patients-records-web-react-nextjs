/** @format */

import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Image from "next/image";

import classes from "./dropdown-anamnesis-type.module.css";
import { useOutsideAlerter } from "@/hooks/use-outside-alerter";
import Modal, { ModalTheme } from "./modal";
import Button, { ButtonStyle } from "./button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NotificationContext } from "@/store/notification-context";

import LoadingSpinner from "./loading-spinner";
import {
  createAnamnesisType,
  getAnamnesisTypesList,
} from "@/api/customers/anamnesisTypesApi";
import { GetAnamnesisTypesResponse } from "@/models/customers/anamnesis-types/GetAnamnesisTypesResponse";
import { CreateAnamnesisTypeRequest } from "@/models/customers/anamnesis-types/CreateAnamnesisTypeRequest";
import { CreateAnamnesisTypeResponse } from "@/models/customers/anamnesis-types/CreateAnamnesisTypeResponse";
import { Item } from "./dropdown-service-type";
import useInput from "@/hooks/use-input";
import { isNotEmpty } from "@/util/field-validations";
import Input, { InputTheme, InputType } from "./input";
import TextArea from "./textarea";

export type ItemAnamnesis = {
  id: string;
  description: string;
  selected: boolean;
  value: any;
  anamnesisTypeContent?: string | null;
  anamnesisTypeContentIsValid?: boolean | string;
  show?: boolean;
};

type Props = {
  label: string;
  id: string;
  idPropertyName: string;
  descriptionPropertyName: string;
  selectedValues?: Item | Item[] | ItemAnamnesis[] | undefined;
  onChangeHandler?: (selectedItem: ItemAnamnesis[] | undefined) => void;
  onBlurHandler?: () => void;
  hasError?: boolean;
  errorMessage?: string;
};

const DropdownAnamnesisTypes = ({
  label,
  idPropertyName,
  descriptionPropertyName,
  id,
  hasError,
  errorMessage,
  selectedValues,
  onChangeHandler,
  onBlurHandler,
}: Props) => {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const [anamnesisTypesList, setAnamnesissTypeList] = useState<
    GetAnamnesisTypesResponse | undefined
  >(undefined);
  const [itemsList, setItemsList] = useState<ItemAnamnesis[]>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string | undefined>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [newAnamnesisDescription, setNewAnamnesisDescription] = useState<
    string | undefined
  >("");
  const [newAnamnesisTemplate, setNewAnamnesisTemplate] = useState<
    string | undefined
  >("");

  const [existingAnamnesisTypes, setExistingAnamnesisTypes] = useState<
    ItemAnamnesis[] | undefined
  >(undefined);
  const [showCreateNewAnamnesisTypeModal, setShowCreateNewAnamnesisTypeModal] =
    useState<boolean>(false);
  const [alreadyValidated, setAlreadyValidated] = useState<boolean>(false);

  const [showCreateAnamnesisTypeModal, setShowCreateAnamnesisTypeModal] =
    useState<boolean>(false);

  const {
    value: enteredAnamnesisTypeDescription,
    isValid: enteredAnamnesisTypeDescriptionIsValid,
    hasError: enteredAnamnesisTypeDescriptionInputHasError,
    valueChangeHandler: enteredAnamnesisTypeDescriptionChangedHandler,
    inputBlurHandler: enteredAnamnesisTypeDescriptionBlurHandler,
    reset: resetEnteredAnamnesisTypeDescriptionInput,
    setEnteredValue: setEnteredAnamnesisTypeDescription,
  } = useInput({ validateValue: isNotEmpty });

  const {
    value: enteredAnamnesisTypeTemplate,
    isValid: enteredAnamnesisTypeTemplateIsValid,
    hasError: enteredAnamnesisTypeTemplateInputHasError,
    valueChangeHandler: enteredAnamnesisTypeTemplateChangedHandler,
    inputBlurHandler: enteredAnamnesisTypeTemplateBlurHandler,
    reset: resetEnteredAnamnesisTypeTemplateInput,
    setEnteredValue: setEnteredAnamnesisTypeTemplate,
  } = useInput({ validateValue: isNotEmpty });

  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

  const wrapperRef = useRef(null);
  useOutsideAlerter({
    ref: wrapperRef,
    callback: () => setShowDropdown(false),
  });

  const getAnamnesisTypesAsync = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getAnamnesisTypesList(userCustom.accessToken);
        if (response.ok) {
          const apiResponseBody = response.body as GetAnamnesisTypesResponse;
          setAnamnesissTypeList(apiResponseBody);
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
  }, [userCustom?.accessToken, router.query]);

  useEffect(() => {
    setIsLoading(true);

    if (userCustom?.accessToken) {
      getAnamnesisTypesAsync();
    } else {
      setIsLoading(false);
    }
  }, [userCustom?.accessToken]);

  useEffect(() => {
    searchInputRef.current && searchInputRef.current.focus();
  }, [showDropdown]);

  const sortItemsList = (list: ItemAnamnesis[]): ItemAnamnesis[] => {
    const newList = [...list];
    newList.sort((a, b) => {
      if (a.value.isDefault && !b.value.isDefault) {
        return 1;
      } else if (!a.value.isDefault && b.value.isDefault) {
        return -1;
      }
      return a.value.anamnesisTypeDescription.localeCompare(
        b.value.anamnesisTypeDescription
      );
    });
    return newList;
  };

  useEffect(() => {
    if (anamnesisTypesList) {
      const newItems: ItemAnamnesis[] = [];
      const newSelectedTypes: ItemAnamnesis[] = [];
      anamnesisTypesList.anamnesisTypes!.forEach((element: any) => {
        let selected = false;
        if (element[descriptionPropertyName] === "Texto Livre") {
          selected = true;
        }
        const newItem = {
          selected: selected,
          value: element,
          id: element[idPropertyName],
          description: element[descriptionPropertyName],
          anamnesisTypeContent: "",
          anamnesisTypeContentIsValid: false,
          show: true,
        };
        newItems.push(newItem);
        if (selected) {
          newSelectedTypes.push(newItem);
        }
      });
      setItemsList(sortItemsList(newItems));
      if (newSelectedTypes && newSelectedTypes.length > 0) {
        onChangeHandler && onChangeHandler(newSelectedTypes!);
      }
    }
  }, [anamnesisTypesList]);

  const getPlaceHolder = useCallback(() => {
    const selectedItems = itemsList?.filter((item) => item.selected);
    if (selectedItems != undefined && selectedItems.length > 0) {
      return (
        <div className={classes.selected_placeholder_container}>
          {selectedItems.map(
            (item, index) =>
              index < 2 && (
                <p
                  key={item.id}
                  className={classes.selected_placeholder_container_item}
                >
                  {item.description}
                </p>
              )
          )}
          {selectedItems.length >= 3 && (
            <p className={classes.selected_placeholder_container_item}>...</p>
          )}
        </div>
      );
    } else {
      return (
        <div className={classes.selected_placeholder_container}>
          <p className={classes.selected_placeholder_no_items}>Procurar...</p>
        </div>
      );
    }
  }, [selectedValues, itemsList]);

  useEffect(() => {
    itemsList?.forEach((item) => (item.selected = false));
    (selectedValues as ItemAnamnesis[])?.length > 0 &&
      (selectedValues as ItemAnamnesis[])?.forEach((selected) => {
        const matchingItems = itemsList?.filter(
          (item) => item.id === selected.id
        );
        matchingItems?.forEach(
          (matchingItem) => (matchingItem.selected = true)
        );
      });
    forceUpdate();
  }, [selectedValues, itemsList]);

  const changeHandler = (e: any) => {
    let item = itemsList?.find((i) => i.id == e.target.value);
    if (item) {
      item.selected = !item.selected;
    }
    setItemsList([...itemsList!]);
    const selectedItems = itemsList?.filter((item) => item.selected === true);
    onChangeHandler && onChangeHandler(selectedItems!);
  };

  const blurHandler = () => {
    onBlurHandler && onBlurHandler();
  };

  const onInputChangeHandler = (event: any) => {
    const newItemList = [...itemsList!];
    newItemList?.forEach((item) => {
      if (
        item.description
          .toLocaleLowerCase()
          .includes(event.target.value.toLocaleLowerCase())
      ) {
        item.show = true;
      } else {
        item.show = false;
      }
    });
    setSearchText(event.target.value);
    setItemsList(newItemList);
  };

  const onInputBlurHandler = () => {
    const newItemList = [...itemsList!];
    newItemList?.forEach((item) => {
      item.show = true;
    });
    setSearchText("");
    setItemsList(newItemList);
    blurHandler();
  };

  const onNewAnamnesisInputChangeHandler = (event: any) => {
    setNewAnamnesisDescription(event.target.value);
  };

  const onNewAnamnesisInputBlurHandler = () => {};

  const validaCreateNewAnamnesisType = (): boolean => {
    if (
      !newAnamnesisDescription ||
      newAnamnesisDescription === "" ||
      !newAnamnesisTemplate ||
      newAnamnesisTemplate === ""
    )
      return false;

    const existingAnamnesisType = itemsList?.filter((item) =>
      item.description.includes(newAnamnesisDescription)
    );

    if (existingAnamnesisType && existingAnamnesisType.length > 0) {
      setShowDropdown(false);
      setExistingAnamnesisTypes(existingAnamnesisType);
      setShowCreateNewAnamnesisTypeModal(true);
      return false;
    } else {
      return true;
    }
  };

  const onClickCreateNewAnamnesisType = () => {
    // if (!validaCreateNewAnamnesisType()) {
    //   return;
    // }
    setShowDropdown(false);
    setShowCreateAnamnesisTypeModal(true);
  };

  const onCancelCreateNewAnamnesisTypeHandler = () => {
    setNewAnamnesisDescription("");
    setShowCreateAnamnesisTypeModal(false);
  };

  const createNewAnamnesisType = async () => {
    setIsLoading(true);

    const createAnamnesisTypeRequest = new CreateAnamnesisTypeRequest(
      newAnamnesisDescription!,
      newAnamnesisTemplate!
    );

    const apiResponse = await createAnamnesisType(
      userCustom.accessToken,
      createAnamnesisTypeRequest
    );

    if (apiResponse.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "Seu novo tipo de anamnese foi criado!",
      };
      notificationCtx.showNotification(notification);
      const createAnamnesisTypeResponse =
        apiResponse.body as CreateAnamnesisTypeResponse;
      const newItemList = [...itemsList!];
      newItemList.push({
        id: createAnamnesisTypeResponse.anamnesisTypeId,
        description: createAnamnesisTypeResponse.anamnesisTypeDescription,
        selected: true,
        value: createAnamnesisTypeResponse,
        show: true,
      });

      setItemsList(sortItemsList(newItemList));
      setShowCreateAnamnesisTypeModal(false);
      setShowCreateNewAnamnesisTypeModal(false);
      setNewAnamnesisDescription("");
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

  const existingTypesChangeHandler = (e: any) => {
    let item = existingAnamnesisTypes?.find((i) => i.id == e.target.value);
    if (item) {
      item.selected = !item.selected;
    }
    setExistingAnamnesisTypes([...existingAnamnesisTypes!]);
  };

  const useExistingAnamnesisTypes = () => {
    const selectedExistingAnamnesisTypes = existingAnamnesisTypes?.filter(
      (item) => item.selected
    );

    if (
      !selectedExistingAnamnesisTypes ||
      selectedExistingAnamnesisTypes.length === 0
    ) {
      return;
    }

    const newItemList = [...itemsList!];
    selectedExistingAnamnesisTypes.forEach((item) => {
      const existingAnamnesisType = newItemList?.find(
        (itemsListItem) => itemsListItem.id === item.id
      );
      existingAnamnesisType!.selected = true;
    });
    setItemsList(newItemList);
    setExistingAnamnesisTypes(undefined);
    setShowCreateNewAnamnesisTypeModal(false);
    setNewAnamnesisDescription("");
    setAlreadyValidated(true);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {showCreateNewAnamnesisTypeModal && (
        <Modal
          onClose={() => setShowCreateNewAnamnesisTypeModal(false)}
          title="Existem tipos de atendimentos semelhantes:"
          titleStyle={{ fontSize: "1.5rem" }}
        >
          <p className={classes.existing_service_types_modal_subtitle}>
            Os seguintes tipos podem atender a sua solicitação:
          </p>
          <div className={classes.existing_service_types_modal_list}>
            {existingAnamnesisTypes?.map((item, index) => (
              <div key={index} className={classes.list_item}>
                <input
                  name={item.description}
                  className={classes.list_item_input}
                  type="radio"
                  value={item.id}
                  onClick={existingTypesChangeHandler}
                  onChange={() => {}}
                  checked={item.selected === true}
                />
                <p className={classes.list_item_description}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className={classes.existing_service_types_modal_actions}>
            <Button
              style={ButtonStyle.NEUTRAL}
              onClickHandler={createNewAnamnesisType}
            >
              Prosseguir com a criação
            </Button>
            <Button
              style={ButtonStyle.SUCCESS_BORDERED}
              onClickHandler={useExistingAnamnesisTypes}
            >
              Usar o(s) tipo(s) selecionado(s)
            </Button>
          </div>
        </Modal>
      )}
      {showCreateAnamnesisTypeModal && (
        <Modal
          onClose={() => setShowCreateAnamnesisTypeModal(false)}
          title="Novo Tipo de Anamnese"
          titleStyle={{ fontSize: "1.5rem" }}
          theme={ModalTheme.LIGHT_BLUE}
        >
          <div className={classes.modal_new_anamnesis_type_controls}>
            <div>
              <Input
                inputTheme={InputTheme.SECONDARY}
                type={InputType.TEXT}
                label={"Nome"}
                id={"new-anamnesis-type-description-create"}
                hasError={enteredAnamnesisTypeDescriptionInputHasError}
                errorMessage={"O nome do tipo da anamnese é inválido"}
                value={enteredAnamnesisTypeDescription}
                onChangeHandler={enteredAnamnesisTypeDescriptionChangedHandler}
                onBlurHandler={enteredAnamnesisTypeDescriptionBlurHandler}
              />
            </div>
            <div>
              <TextArea
                label={"Nome"}
                rows={20}
                id={"new-anamnesis-type-template-create"}
                hasError={enteredAnamnesisTypeTemplateInputHasError}
                errorMessage={"O template do tipo da anamnese é inválido"}
                value={enteredAnamnesisTypeTemplate}
                onChangeHandler={enteredAnamnesisTypeTemplateChangedHandler}
                onBlurHandler={enteredAnamnesisTypeTemplateBlurHandler}
                required
              />
            </div>
          </div>
          <div className={classes.existing_service_types_modal_actions}>
            <Button
              style={ButtonStyle.NEUTRAL}
              onClickHandler={onCancelCreateNewAnamnesisTypeHandler}
            >
              Cancelar
            </Button>
            <Button
              style={ButtonStyle.SUCCESS_BORDERED}
              onClickHandler={createNewAnamnesisType}
            >
              Criar
            </Button>
          </div>
        </Modal>
      )}
      <div className={classes.container_wrapper}>
        <div ref={wrapperRef} className={classes.container}>
          <label className={classes.label}>{label}</label>
          <button
            className={classes.chevron_button}
            onClick={() => {
              setShowDropdown((prevState) => !prevState);
              searchInputRef.current && searchInputRef.current.focus();
            }}
            onBlur={onInputBlurHandler}
          >
            {!showDropdown ? (
              getPlaceHolder()
            ) : (
              <input
                id={id}
                ref={searchInputRef}
                className={classes.input}
                placeholder={"Procurar"}
                onBlur={onInputBlurHandler}
                onChange={onInputChangeHandler}
                value={searchText}
              />
            )}
            <Image
              src={`/images/chevron_down_black.svg`}
              alt="Tipos de atendimento"
              width={25}
              height={25}
            />
          </button>
          {showDropdown && (
            <div className={classes.list}>
              <button className={classes.chevron_button}>
                <input
                  className={classes.input}
                  placeholder={"Cadastre um novo tipo..."}
                  onBlur={onNewAnamnesisInputBlurHandler}
                  onChange={onNewAnamnesisInputChangeHandler}
                  value={newAnamnesisDescription}
                />
                <Image
                  src={`/images/plus-filled.svg`}
                  alt="Criar novo tipo"
                  width={25}
                  height={25}
                  onClick={onClickCreateNewAnamnesisType}
                  className={classes.plus_button}
                />
              </button>
              {itemsList?.map((item) => (
                <div key={item.id}>
                  {item.show && (
                    <div key={item.id} className={classes.list_item}>
                      <input
                        name={item.description}
                        className={classes.list_item_input}
                        type="radio"
                        value={item.id}
                        onClick={changeHandler}
                        onChange={() => {}}
                        checked={item.selected}
                      />
                      <p className={classes.list_item_description}>
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div className={classes.actions}>
          <Button style={ButtonStyle.SUCCESS} onClickHandler={() => {}}>
            Criar Template
          </Button>
        </div> */}
      </div>
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default DropdownAnamnesisTypes;
