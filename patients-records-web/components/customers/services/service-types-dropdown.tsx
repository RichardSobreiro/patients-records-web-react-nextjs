/** @format */

import { getServiceTypesList } from "@/api/customers/serviceTypesApi";
import DropdownMultiple from "@/components/ui/dropdown-multiple";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  GetServiceTypeResponse,
  GetServiceTypesResponse,
} from "@/models/customers/service-types/GetServiceTypesResponse";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";

type Props = {
  serviceTypesSelected: GetServiceTypeResponse[];
};

const ServiceTypesDropdown = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationCtx = useContext(NotificationContext);

  const [serviceTypesList, setServicesTypeList] = useState<
    GetServiceTypesResponse | undefined
  >(undefined);

  const userCustom: any = session?.user;

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

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div>
        <DropdownMultiple
          label={"Tipo(s) do Atendimento:"}
          list={serviceTypesList?.serviceTypes}
          id={"service-type-create"}
          idPropertyName={"serviceTypeId"}
          descriptionPropertyName={"serviceTypeDescription"}
          //   selectedValues={serviceTypesSelected}
          //   onBlurHandler={typeBlurHandler}
          //   onChangeHandler={typeChangeHandler}
          //   hasError={typeInputHasError}
          errorMessage="O tipo do atendimento deve ser selecionado"
        />
      </div>
    </>
  );
};

export default ServiceTypesDropdown;
