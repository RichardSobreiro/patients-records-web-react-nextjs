/** @format */

import Input, { InputType } from "@/components/ui/input";
import classes from "./services-list.module.css";
import Dropdown from "@/components/ui/dropdown";
import { serviceTypes } from "@/util/constants/lists";
import Button, { ButtonStyle } from "@/components/ui/button";
import { useRouter } from "next/router";

const ServicesList = () => {
  const router = useRouter();

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
