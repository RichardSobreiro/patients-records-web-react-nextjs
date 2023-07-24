/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./services-list.module.css";
import Dropdown from "@/components/ui/dropdown";
import { serviceTypes } from "@/util/constants/lists";
import Button, { ButtonStyle } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/store/notification-context";
import { GetServiceResponse } from "@/models/customers/services/GetServicesResponse";
import { getServices } from "@/api/customers/servicesApi";

const ServicesList = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationCtx = useContext(NotificationContext);
  const [servicesList, setServicesList] = useState<
    GetServiceResponse | undefined
  >();

  const userCustom: any = session?.user;

  const getServiceList = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getServices(
          userCustom.accessToken,
          "1",
          "10",
          router.query.customerId as string
        );
        if (response.ok) {
          const apiResponseBody = response.body as GetServiceResponse;
          setServicesList(apiResponseBody);
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
      getServiceList();
    }
  }, [userCustom?.accessToken, router.query.customerId]);

  return (
    <>
      <section className={classes.services_container}>
        <div className={classes.title}>
          <p>Atendimentos</p>
        </div>
        <div className={classes.search_container}>
          <div className={classes.search_container_left}>
            <div>
              <Input
                type={InputType.DATE}
                label={"Início (Data do Atendimento)"}
                id={""}
                hasError={false}
                errorMessage={""}
              />
            </div>
            <div>
              <Input
                type={InputType.DATE}
                label={"Fim (Data do Atendimento)"}
                id={""}
                hasError={false}
                errorMessage={""}
              />
            </div>
            <div>
              <Dropdown
                label={"Tipo do Atendimento"}
                list={serviceTypes}
                id={"search-service-type"}
                idPropertyName={"id"}
                descriptionPropertyName={"description"}
                value={undefined}
              />
            </div>
          </div>
          <div className={classes.search_container_right}>
            <Button
              style={ButtonStyle.PRIMARY_BODERED}
              onClickHandler={() => {
                router.push(
                  `/clientes/editar/${router.query.customerId}/atendimentos/criar`
                );
              }}
            >
              + Atendimento
            </Button>
          </div>
        </div>
        <div className={classes.services_list_table}>
          <div className={classes.table_header}>
            <div className={classes.table_header_cell}>Tipo</div>
            <div className={classes.table_header_cell}>Data de Criação</div>
            <div className={classes.table_header_cell}></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesList;
