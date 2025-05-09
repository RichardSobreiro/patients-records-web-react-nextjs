/** @format */

import { GetAnamnesis } from "@/models/customers/GetAnamnesisResponse";

import classes from "./anamnesis-list-row.module.css";
import Button, { ButtonStyle } from "@/components/ui/button";

import { useRouter } from "next/router";
import { formatDateTimePTBR } from "@/util/date-helpers";

type Props = {
  anamnesis: GetAnamnesis;
};

const AnamnesisListRow = ({ anamnesis }: Props) => {
  const router = useRouter();
  return (
    <>
      <article key={anamnesis.anamneseId} className={classes.row}>
        <div className={classes.cell_service_types}>
          {anamnesis.anamnesisTypeDescriptions &&
            anamnesis.anamnesisTypeDescriptions.length > 0 &&
            anamnesis.anamnesisTypeDescriptions.map(
              (anamnesisTypeDescription) => {
                return <p>{anamnesisTypeDescription}</p>;
              }
            )}
        </div>
        <div className={classes.cell}>{formatDateTimePTBR(anamnesis.date)}</div>
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
