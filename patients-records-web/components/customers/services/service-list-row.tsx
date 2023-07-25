/** @format */

import classes from "./service-list-row.module.css";
import Button, { ButtonStyle } from "@/components/ui/button";
import { GetServiceResponse } from "@/models/customers/services/GetServicesResponse";
import { formatDateTimePTBR } from "@/util/date-helpers";

import { useRouter } from "next/router";

type Props = {
  service: GetServiceResponse;
};

const ServiceListRow = ({ service }: Props) => {
  const router = useRouter();
  return (
    <>
      <article key={service.serviceId} className={classes.row}>
        <div className={classes.cell_service_types}>
          {service.serviceTypes &&
            service.serviceTypes.length > 0 &&
            service.serviceTypes.map((type) => {
              return <p>{type.serviceTypeDescription}</p>;
            })}
        </div>
        <div className={classes.cell}>{formatDateTimePTBR(service.date)}</div>
        <div className={classes.cell}>
          <Button
            style={ButtonStyle.SUCCESS_SMALL}
            onClickHandler={() =>
              router.push(
                `/clientes/editar/${service.customerId}/atendimentos/${service.serviceId}/editar`
              )
            }
          >
            Editar
          </Button>
        </div>
      </article>
    </>
  );
};

export default ServiceListRow;
