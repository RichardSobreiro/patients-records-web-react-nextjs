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
  updateAnamnesisType,
} from "@/api/customers/anamnesisTypesApi";
import { GetAnamnesisTypesResponse } from "@/models/customers/anamnesis-types/GetAnamnesisTypesResponse";
import { CreateAnamnesisTypeRequest } from "@/models/customers/anamnesis-types/CreateAnamnesisTypeRequest";
import { CreateAnamnesisTypeResponse } from "@/models/customers/anamnesis-types/CreateAnamnesisTypeResponse";
import { Item } from "./dropdown-service-type";
import useInput from "@/hooks/use-input";
import { isNotEmpty } from "@/util/field-validations";
import Input, { InputTheme, InputType } from "./input";
import TextArea, { TextAreaTheme } from "./textarea";
import { ApiResponse } from "@/models/Api/ApiResponse";
import { UpdateAnamnesisTypeRequest } from "@/models/customers/anamnesis-types/UpdateAnamnesisTypeRequest";
import { UpdateAnamnesisTypeResponse } from "@/models/customers/anamnesis-types/UpdateAnamnesisTypeResponse";
import { FileCustom } from "@/hooks/use-file-input";
import useTextArea from "@/hooks/use-textarea";
import { convertFromHTML } from "draft-convert";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

export type ItemAnamnesis = {
  id: string;
  description: string;
  selected: boolean;
  value: any;
  anamnesisTypeContent?: string | null | FileCustom[];
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
  onlyFilter?: boolean;
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
  onlyFilter,
}: Props) => {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const [anamnesisTypesList, setAnamnesissTypeList] = useState<
    GetAnamnesisTypesResponse | undefined
  >(undefined);
  const [itemsList, setItemsList] = useState<ItemAnamnesis[]>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string | undefined>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [existingAnamnesisTypes, setExistingAnamnesisTypes] = useState<
    ItemAnamnesis[] | undefined
  >(undefined);

  const [
    showCreateEditAnamnesisTypeModal,
    setShowCreateEditAnamnesisTypeModal,
  ] = useState<boolean>(false);

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
    editorState: enteredAnamnesisTypeTemplate,
    isValid: enteredAnamnesisTypeTemplateIsValid,
    hasError: enteredAnamnesisTypeTemplateInputHasError,
    valueChangeHandler: enteredAnamnesisTypeTemplateChangedHandler,
    inputBlurHandler: enteredAnamnesisTypeTemplateBlurHandler,
    reset: resetEnteredAnamnesisTypeTemplateInput,
    setEditorState: setEnteredAnamnesisTypeTemplate,
  } = useTextArea({ validateValue: () => true });

  const [anamnesisTypeBeingEditedId, setAnamnesisTypeBeingEditedId] = useState<
    string | undefined
  >(undefined);

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
        if (element[descriptionPropertyName] === "Texto Livre" && !onlyFilter) {
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
      if (
        newSelectedTypes &&
        newSelectedTypes.length > 0 &&
        (!selectedValues || (selectedValues as ItemAnamnesis[]).length === 0)
      ) {
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
    itemsList?.forEach((item) => {
      item.selected = false;
    });
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
    let selectedItems: ItemAnamnesis[] =
      selectedValues && (selectedValues as ItemAnamnesis[])?.length > 0
        ? ([...(selectedValues as ItemAnamnesis[])] as ItemAnamnesis[])
        : [];
    if (item?.selected) {
      selectedItems.push(item);
    } else {
      selectedItems = selectedItems.filter(
        (selectedItem) => selectedItem.id !== item?.id
      );
    }
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

  const validaCreateNewAnamnesisType = (): boolean => {
    if (
      !enteredAnamnesisTypeDescriptionIsValid ||
      !enteredAnamnesisTypeTemplateIsValid
    ) {
      return false;
    }
    return true;
  };

  const onClickCreateNewAnamnesisType = () => {
    setShowDropdown(false);
    setShowCreateEditAnamnesisTypeModal(true);
  };

  const onClickUpdateAnamnesisType = (item: ItemAnamnesis) => {
    setShowDropdown(false);

    setEnteredAnamnesisTypeDescription(item.description);
    setEnteredAnamnesisTypeTemplate(
      EditorState.createWithContent(
        convertFromHTML(item.value.template as string)
      )
    );
    setAnamnesisTypeBeingEditedId(item.id);

    setShowCreateEditAnamnesisTypeModal(true);
  };

  const onCancelCreateEditAnamnesisTypeHandler = () => {
    resetEnteredAnamnesisTypeDescriptionInput();
    resetEnteredAnamnesisTypeTemplateInput();
    setAnamnesisTypeBeingEditedId(undefined);
    setShowCreateEditAnamnesisTypeModal(false);
  };

  const saveCreateEditAnamnesisType = async () => {
    if (!validaCreateNewAnamnesisType()) {
      return;
    }
    setIsLoading(true);

    let apiResponse: ApiResponse | undefined = undefined;

    if (anamnesisTypeBeingEditedId !== undefined) {
      const editAnamnesisTypeRequest = new UpdateAnamnesisTypeRequest(
        anamnesisTypeBeingEditedId,
        enteredAnamnesisTypeDescription!,
        draftToHtml(
          convertToRaw(enteredAnamnesisTypeTemplate!.getCurrentContent())
        )
      );

      apiResponse = await updateAnamnesisType(
        userCustom.accessToken,
        editAnamnesisTypeRequest
      );
    } else {
      const createAnamnesisTypeRequest = new CreateAnamnesisTypeRequest(
        enteredAnamnesisTypeDescription!,
        draftToHtml(
          convertToRaw(enteredAnamnesisTypeTemplate!.getCurrentContent())
        )
      );

      apiResponse = await createAnamnesisType(
        userCustom.accessToken,
        createAnamnesisTypeRequest
      );
    }

    if (apiResponse?.ok) {
      let newItemList: ItemAnamnesis[] = [...itemsList!];

      if (anamnesisTypeBeingEditedId === undefined) {
        const createAnamnesisTypeResponse =
          apiResponse.body as CreateAnamnesisTypeResponse;
        newItemList.push({
          id: createAnamnesisTypeResponse.anamnesisTypeId,
          description: createAnamnesisTypeResponse.anamnesisTypeDescription,
          selected: true,
          value: createAnamnesisTypeResponse,
          show: true,
          anamnesisTypeContent: createAnamnesisTypeResponse.template,
          anamnesisTypeContentIsValid: true,
        });
        const newSelectedTypes = newItemList.filter((item) => item.selected);
        onChangeHandler && onChangeHandler(newSelectedTypes);
      } else {
        const updateAnamnesisTypeResponse =
          apiResponse.body as UpdateAnamnesisTypeResponse;
        const existingItem = newItemList.find(
          (item) => item.id === updateAnamnesisTypeResponse.anamnesisTypeId
        );
        if (existingItem) {
          existingItem!.description =
            updateAnamnesisTypeResponse.anamnesisTypeDescription;
          existingItem.selected = true;
          existingItem.value.template = updateAnamnesisTypeResponse.template;
        }
      }

      setItemsList(sortItemsList(newItemList));
      setShowCreateEditAnamnesisTypeModal(false);

      const notification = {
        status: "success",
        title: "Sucesso",
        message:
          anamnesisTypeBeingEditedId !== undefined
            ? "Template de anamnese atualizado!"
            : "Seu novo tipo de anamnese foi criado!",
      };
      notificationCtx.showNotification(notification);

      resetEnteredAnamnesisTypeDescriptionInput();
      resetEnteredAnamnesisTypeTemplateInput();
      setAnamnesisTypeBeingEditedId(undefined);
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
      {showCreateEditAnamnesisTypeModal && (
        <Modal
          onClose={() => setShowCreateEditAnamnesisTypeModal(false)}
          title={
            anamnesisTypeBeingEditedId != undefined
              ? "Editando Template de Anamnese"
              : "Novo Template de Anamnese"
          }
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
                label={"Template da Anamnese"}
                rows={20}
                id={"new-anamnesis-type-template-create"}
                hasError={enteredAnamnesisTypeTemplateInputHasError}
                errorMessage={"O template do tipo da anamnese é inválido"}
                editorState={enteredAnamnesisTypeTemplate}
                onChangeHandler={enteredAnamnesisTypeTemplateChangedHandler}
                onBlurHandler={enteredAnamnesisTypeTemplateBlurHandler}
                required
                theme={TextAreaTheme.SECONDARY}
              />
            </div>
          </div>
          <div className={classes.existing_service_types_modal_actions}>
            <Button
              style={ButtonStyle.NEUTRAL}
              onClickHandler={onCancelCreateEditAnamnesisTypeHandler}
            >
              Cancelar
            </Button>
            <Button
              style={ButtonStyle.SUCCESS}
              onClickHandler={saveCreateEditAnamnesisType}
            >
              Salvar
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
              {/* <button className={classes.chevron_button}>
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
              </button> */}
              {itemsList?.map((item) => (
                <div key={item.id}>
                  {item.show && (
                    <div key={item.id} className={classes.list_item}>
                      <div className={classes.list_item_left}>
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

                      <div className={classes.list_item_right}>
                        {!item.value.isDefault && (
                          <Image
                            src={`/images/pencil.svg`}
                            alt="Criar novo tipo"
                            width={25}
                            height={25}
                            onClick={onClickUpdateAnamnesisType.bind(
                              null,
                              item
                            )}
                            className={classes.plus_button}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={classes.actions}>
          {!onlyFilter && (
            <Button
              style={ButtonStyle.SUCCESS}
              onClickHandler={onClickCreateNewAnamnesisType}
            >
              Criar Template
            </Button>
          )}
        </div>
      </div>
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default DropdownAnamnesisTypes;
