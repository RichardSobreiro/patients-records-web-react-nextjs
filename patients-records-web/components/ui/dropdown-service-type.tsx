/** @format */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";

import classes from "./dropdown-service-type.module.css";
import { useOutsideAlerter } from "@/hooks/use-outside-alerter";
import Modal from "./modal";
import Button, { ButtonStyle } from "./button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NotificationContext } from "@/store/notification-context";
import { CreateServiceTypeRequest } from "@/models/customers/service-types/CreateServiceTypeRequest";
import {
  createServiceType,
  getServiceTypesList,
} from "@/api/customers/serviceTypesApi";
import { CreateServiceTypeResponse } from "@/models/customers/service-types/CreateServiceTypeResponse";
import { GetServiceTypesResponse } from "@/models/customers/service-types/GetServiceTypesResponse";
import LoadingSpinner from "./loading-spinner";

export type Item = {
  id: string;
  description: string;
  selected: boolean;
  value: any;
  show?: boolean;
};

type Props = {
  label: string;
  id: string;
  idPropertyName: string;
  descriptionPropertyName: string;
  selectedValues?: Item | Item[] | undefined;
  onChangeHandler?: (selectedItem: Item | Item[] | undefined) => void;
  onBlurHandler?: () => void;
  hasError?: boolean;
  errorMessage?: string;
};

const DropdownServiceTypes = ({
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
  const [serviceTypesList, setServicesTypeList] = useState<
    GetServiceTypesResponse | undefined
  >(undefined);
  const [itemsList, setItemsList] = useState<Item[]>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string | undefined>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [newServiceDescription, setNewServiceDescription] = useState<
    string | undefined
  >("");
  const [existingServiceTypes, setExistingServiceTypes] = useState<
    Item[] | undefined
  >(undefined);
  const [showCreateNewServiceTypeModal, setShowCreateNewServiceTypeModal] =
    useState<boolean>(false);
  const [alreadyValidated, setAlreadyValidated] = useState<boolean>(false);

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const [isMouseOverDropdown, setIsMouseOverDropdown] =
    useState<boolean>(false);

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

  const getServiceTypesAsync = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getServiceTypesList(userCustom.accessToken);
        if (response.ok) {
          const apiResponseBody = response.body as GetServiceTypesResponse;
          setServicesTypeList(apiResponseBody);
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

    if (userCustom?.accessToken && router.query.customerId) {
      getServiceTypesAsync();
    }
  }, [
    userCustom?.accessToken,
    router.query.customerId,
    router.query.anamnesisId,
  ]);

  useEffect(() => {
    searchInputRef.current && searchInputRef.current.focus();
  }, [showDropdown]);

  const sortItemsList = (list: Item[]): Item[] => {
    const newList = [...list];
    newList.sort((a, b) => {
      if (a.value.isDefault && !b.value.isDefault) {
        return 1;
      } else if (!a.value.isDefault && b.value.isDefault) {
        return -1;
      }
      return a.value.serviceTypeDescription.localeCompare(
        b.value.serviceTypeDescription
      );
    });
    return newList;
  };

  useEffect(() => {
    if (serviceTypesList) {
      const newItems: Item[] = [];
      serviceTypesList.serviceTypes!.forEach((element: any) => {
        newItems.push({
          selected: false,
          value: element,
          id: element[idPropertyName],
          description: element[descriptionPropertyName],
          show: true,
        });
      });
      setItemsList(sortItemsList(newItems));
    }
  }, [serviceTypesList]);

  const getPlaceHolder = () => {
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
  };

  const changeHandler = (e: any) => {
    let item = itemsList?.find((i) => i.id == e.target.value);
    if (item) {
      item.selected = !item.selected;
    }
    setItemsList([...itemsList!]);
    selectedValues = itemsList?.filter((item) => item.selected);
    onChangeHandler && onChangeHandler(itemsList!);
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

  const onNewServiceInputChangeHandler = (event: any) => {
    setNewServiceDescription(event.target.value);
  };

  const onNewServiceInputBlurHandler = () => {};

  const validaCreateNewServiceType = (): boolean => {
    if (!newServiceDescription || newServiceDescription === "") return false;

    const existingServiceType = itemsList?.filter((item) =>
      item.description.includes(newServiceDescription)
    );

    if (existingServiceType && existingServiceType.length > 0) {
      setShowDropdown(false);
      setExistingServiceTypes(existingServiceType);
      setShowCreateNewServiceTypeModal(true);
      return false;
    } else {
      return true;
    }
  };

  const onClickCreateNewServiceType = () => {
    if (!validaCreateNewServiceType()) {
      return;
    }
    setShowDropdown(false);
    setShowConfirmationModal(true);
  };

  const onCancelCreateNewServiceTypeHandler = () => {
    setNewServiceDescription("");
    setShowConfirmationModal(false);
  };

  const createNewServiceType = async () => {
    setIsLoading(true);

    const createServiceTypeRequest = new CreateServiceTypeRequest(
      newServiceDescription!
    );

    const apiResponse = await createServiceType(
      userCustom.accessToken,
      createServiceTypeRequest
    );

    if (apiResponse.ok) {
      const notification = {
        status: "success",
        title: "Sucesso",
        message: "Seu novo tipo de atendimento foi criado!",
      };
      notificationCtx.showNotification(notification);
      const createServiceTypeResponse =
        apiResponse.body as CreateServiceTypeResponse;
      const newItemList = [...itemsList!];
      newItemList.push({
        id: createServiceTypeResponse.serviceTypeId,
        description: createServiceTypeResponse.serviceTypeDescription,
        selected: true,
        value: createServiceTypeResponse,
        show: true,
      });

      setItemsList(sortItemsList(newItemList));
      setShowConfirmationModal(false);
      setShowCreateNewServiceTypeModal(false);
      setNewServiceDescription("");
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
    let item = existingServiceTypes?.find((i) => i.id == e.target.value);
    if (item) {
      item.selected = !item.selected;
    }
    setExistingServiceTypes([...existingServiceTypes!]);
  };

  const useExistingServiceTypes = () => {
    const selectedExistingServiceTypes = existingServiceTypes?.filter(
      (item) => item.selected
    );

    if (
      !selectedExistingServiceTypes ||
      selectedExistingServiceTypes.length === 0
    ) {
      return;
    }

    const newItemList = [...itemsList!];
    selectedExistingServiceTypes.forEach((item) => {
      const existingServiceType = newItemList?.find(
        (itemsListItem) => itemsListItem.id === item.id
      );
      existingServiceType!.selected = true;
    });
    setItemsList(newItemList);
    setExistingServiceTypes(undefined);
    setShowCreateNewServiceTypeModal(false);
    setNewServiceDescription("");
    setAlreadyValidated(true);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {showCreateNewServiceTypeModal && (
        <Modal
          onClose={() => setShowCreateNewServiceTypeModal(false)}
          title="Existem tipos de atendimentos semelhantes:"
          titleStyle={{ fontSize: "1.5rem" }}
        >
          <p className={classes.existing_service_types_modal_subtitle}>
            Os seguintes tipos podem atender a sua solicitação:
          </p>
          <div className={classes.existing_service_types_modal_list}>
            {existingServiceTypes?.map((item, index) => (
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
              onClickHandler={createNewServiceType}
            >
              Prosseguir com a criação
            </Button>
            <Button
              style={ButtonStyle.SUCCESS_BORDERED}
              onClickHandler={useExistingServiceTypes}
            >
              Usar o(s) tipo(s) selecionado(s)
            </Button>
          </div>
        </Modal>
      )}
      {showConfirmationModal && (
        <Modal
          onClose={() => setShowConfirmationModal(false)}
          title="Tudo certo?"
          titleStyle={{ fontSize: "1.5rem" }}
        >
          <p className={classes.existing_service_types_modal_subtitle}>
            Confirma a criação do tipo de atendimento:
          </p>
          <div className={classes.existing_service_types_modal_list}>
            <p className={classes.list_item_description}>
              {newServiceDescription}
            </p>
          </div>
          <div className={classes.existing_service_types_modal_actions}>
            <Button
              style={ButtonStyle.NEUTRAL}
              onClickHandler={onCancelCreateNewServiceTypeHandler}
            >
              Cancelar
            </Button>
            <Button
              style={ButtonStyle.SUCCESS_BORDERED}
              onClickHandler={createNewServiceType}
            >
              Criar
            </Button>
          </div>
        </Modal>
      )}
      <div ref={wrapperRef} className={classes.container}>
        <label className={classes.label} htmlFor={id}>
          {label}
        </label>
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
                onBlur={onNewServiceInputBlurHandler}
                onChange={onNewServiceInputChangeHandler}
                value={newServiceDescription}
              />
              <Image
                src={`/images/plus-filled.svg`}
                alt="Criar novo tipo"
                width={25}
                height={25}
                onClick={onClickCreateNewServiceType}
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
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default DropdownServiceTypes;
