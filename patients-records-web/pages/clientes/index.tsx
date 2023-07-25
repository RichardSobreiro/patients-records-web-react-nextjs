/** @format */

import { getCustomers } from "@/api/customers/customersApi";
import Filter from "@/components/customers/filter";
import CustomersList from "@/components/customers/list";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import { GetCustomersResponse } from "@/models/customers/GetCustomersResponse";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";

const Clientes = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [customersList, setCustomersList] = useState<GetCustomersResponse>();
  const notificationCtx = useContext(NotificationContext);

  const [currentPage, setCurrentPage] = useState<number | string>(1);

  const userCustom: any = session?.user;

  if (status === "unauthenticated") {
    router && router.replace("/entrar");
  }

  const getCustomersAsync = useCallback(async () => {
    try {
      const response = await getCustomers(
        userCustom.accessToken,
        currentPage as string,
        "10"
      );
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
  }, [userCustom?.accessToken, currentPage]);

  useEffect(() => {
    setIsLoading(true);

    if (userCustom?.accessToken) {
      getCustomersAsync();
    }
  }, [userCustom?.accessToken]);

  const onSubmitFilter = async () => {
    // if (!startDateIsValid || !endDateIsValid) {
    //   return;
    // }
    setIsLoading(true);
    await getCustomersAsync();
  };

  useEffect(() => {
    onSubmitFilter();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Clientes</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Filter />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <CustomersList customersList={customersList} />
          {customersList && customersList?.customersCount > 0 && (
            <Pagination
              className="pagination_bar"
              currentPage={currentPage as number}
              siblingCount={2}
              totalCount={customersList?.customersCount}
              pageSize={10}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Clientes;
