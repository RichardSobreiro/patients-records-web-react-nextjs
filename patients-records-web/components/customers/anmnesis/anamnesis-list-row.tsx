/** @format */

import { GetAnamnesis } from "@/models/customers/GetAnamnesisResponse";

import classes from "./anamnesis-list-row.module.css";
import Button, { ButtonStyle } from "@/components/ui/button";

import { useRouter } from "next/router";

type Props = {
  anamnesis: GetAnamnesis;
};

const AnamnesisListRow = ({ anamnesis }: Props) => {
  const router = useRouter();
  return (
    <>
      <article key={anamnesis.anamneseId} className={classes.row}>
        <div className={classes.cell}>{anamnesis.type[0]}</div>
        <div className={classes.cell}>{`${new Date(
          anamnesis.date
        ).getDate()}/${new Date(anamnesis.date).getMonth()}/${new Date(
          anamnesis.date
        ).getFullYear()}`}</div>
        <div className={classes.cell}>
          <Button
            style={ButtonStyle.SUCCESS_SMALL}
            onClickHandler={() =>
              router.push(
                `/clientes/editar/${anamnesis.customerId}/anamneses/${anamnesis.anamneseId}/editar`
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

export default AnamnesisListRow;
