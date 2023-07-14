/** @format */

import { getCustomers } from "@/api/customers/customersApi";
import Filter from "@/components/customers/filter";
import CustomersList from "@/components/customers/list";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { GetCustomersResponse } from "@/models/customers/GetCustomersResponse";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";

const Clientes = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [customersList, setCustomersList] = useState<GetCustomersResponse>();
  const notificationCtx = useContext(NotificationContext);

  const userCustom: any = session?.user;

  if (status === "unauthenticated") {
    router && router.replace("/entrar");
  }

  const getCustomersAsync = useCallback(async () => {
    try {
      const response = await getCustomers(userCustom.accessToken, "1", "10");
      if (response.ok) {
        setCustomersList(response.body as GetCustomersResponse);
      } else {
        const notification = {
          status: "error",
          title: "Opsss...",
          message:
            "Tivemos um problema passageiro. Aguarde alguns segundos e tente novamente!",
        };
        notificationCtx.showNotification(notification);
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
  }, [userCustom?.accessToken]);

  useEffect(() => {
    setIsLoading(true);

    if (userCustom?.accessToken) {
      getCustomersAsync();
    }
  }, [userCustom?.accessToken]);

  return (
    <>
      <Filter />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CustomersList customersList={customersList} />
      )}
    </>
  );
};

export default Clientes;
