/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./anamnesis-list.module.css";
import Dropdown from "@/components/ui/dropdown";
import { anamnesisTypesList } from "@/util/constants/lists";
import Button, { ButtonStyle } from "@/components/ui/button";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/store/notification-context";
import { getAnamnesis } from "@/api/customers/anamnesisApi";
import { GetAnamnesisResponse } from "@/models/customers/GetAnamnesisResponse";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AnamnesisListRow from "./anamnesis-list-row";

const AnamnesisList = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationCtx = useContext(NotificationContext);
  const [anamnesisList, setAnamnesisList] = useState<
    GetAnamnesisResponse | undefined
  >();

  const userCustom: any = session?.user;

  const getAnamnesisList = useCallback(async () => {
    if (userCustom?.accessToken) {
      try {
        const response = await getAnamnesis(
          userCustom.accessToken,
          "1",
          "10",
          router.query.customerId as string
        );
        if (response.ok) {
          const apiResponseBody = response.body as GetAnamnesisResponse;
          setAnamnesisList(apiResponseBody);
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
      getAnamnesisList();
    }
  }, [
    userCustom?.accessToken,
    router.query.customerId,
    router.query.anamnesisId,
  ]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <section className={classes.anamnesis_container}>
        <div className={classes.title}>
          <p>Anamneses</p>
        </div>
        <div className={classes.search_container}>
          <div className={classes.search_container_left}>
            <div>
              <Input
                type={InputType.DATE}
                label={"Início (Data de Criação)"}
                id={""}
                hasError={false}
                errorMessage={""}
              />
            </div>
            <div>
              <Input
                type={InputType.DATE}
                label={"Fim (Data de Criação)"}
                id={""}
                hasError={false}
                errorMessage={""}
              />
            </div>
            <div>
              <Dropdown
                label={"Tipo de Anamnese"}
                list={anamnesisTypesList}
                id={"search-anaminesis-type"}
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
                  `/clientes/editar/${router.query.customerId}/anamneses/criar`
                );
              }}
            >
              + Anamnese
            </Button>
          </div>
        </div>
        <div className={classes.anamnesis_list_table}>
          <div className={classes.table_header}>
            <div className={classes.table_header_cell}>Tipo</div>
            <div className={classes.table_header_cell}>Data da Anamnese</div>
            <div className={classes.table_header_cell}></div>
          </div>
          <div className={classes.table_body}>
            {anamnesisList &&
              anamnesisList?.count > 0 &&
              anamnesisList?.anamnesis?.map((anamnesis) => (
                <AnamnesisListRow
                  key={anamnesis.anamneseId}
                  anamnesis={anamnesis}
                />
              ))}
            {!anamnesisList ||
              (anamnesisList?.count == 0 && (
                <p className={classes.list_empty}>
                  Nenhuma anamnese criada para o cliente!
                </p>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AnamnesisList;
