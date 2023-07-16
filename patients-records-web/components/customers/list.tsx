/** @format */

import { GetCustomersResponse } from "@/models/customers/GetCustomersResponse";
import ListItem from "./list-item";

import classes from "./list.module.css";

type Props = {
  customersList?: GetCustomersResponse;
};

const CustomersList = ({ customersList }: Props) => {
  return (
    <>
      {!customersList || customersList?.customers!.length <= 0 ? (
        <div className={classes.no_customers}>
          <p>Nenhum cliente encontrado...</p>
        </div>
      ) : (
        <section className={classes.table_customers_container}>
          <div className={classes.table}>
            <div className={classes.table_header}>
              <div className={classes.table_header_cell}>Nome</div>
              <div className={classes.table_header_cell}>Idade</div>
              <div className={classes.table_header_cell}>Telefone</div>
              <div className={classes.table_header_cell}></div>
            </div>
            {customersList?.customers?.map((customer) => (
              <ListItem key={customer.customerId} customer={customer} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default CustomersList;
