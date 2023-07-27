/** @format */

import { GetCustomer } from "@/models/customers/GetCustomersResponse";
import classes from "./list-item.module.css";

import Image from "next/image";
import Button, { ButtonStyle } from "../ui/button";
import { useRouter } from "next/router";
import { getAgePTBR } from "@/util/date-helpers";

type Props = {
  customer: GetCustomer;
};

const ListItem = ({ customer }: Props) => {
  const router = useRouter();

  return (
    <>
      <article className={classes.row}>
        <div className={classes.cell}>{customer.customerName}</div>
        <div className={classes.cell}>{getAgePTBR(customer.birthDate)}</div>
        <div className={classes.cell}>{customer.phoneNumber}</div>
        <div className={classes.cell}>
          <Button
            style={ButtonStyle.SUCCESS_SMALL}
            onClickHandler={() =>
              router.push(`clientes/editar/${customer.customerId}`)
            }
          >
            Editar
          </Button>
        </div>
      </article>
    </>
  );
};

export default ListItem;
