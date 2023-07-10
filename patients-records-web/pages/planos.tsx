/** @format */

import Button, { ButtonStyle } from "@/components/ui/button";
import classes from "@/styles/Planos.module.css";

import { useRouter } from "next/navigation";

const Planos = () => {
  const router = useRouter();
  return (
    <div className={classes.content}>
      <table className={classes.table}>
        <thead className={classes.table_head}>
          <tr>
            <th></th>
            <th>Grátis</th>
            <th className={classes.table_anual_cell}>Plano Anual</th>
            <th>Mensal</th>
          </tr>
        </thead>
        <tbody className={classes.table_body}>
          <tr>
            <td className={classes.table_skill_cell}>Contrate Agora</td>
            <td>
              <Button
                style={ButtonStyle.PRIMARY_SMALL}
                onClickHandler={() => {
                  router.push("/criar-conta");
                }}
              >
                Contratar
              </Button>
            </td>
            <td className={classes.table_anual_cell}>
              <Button
                style={ButtonStyle.SECONDARY}
                onClickHandler={() => {
                  router.push("/criar-conta");
                }}
              >
                Contratar
              </Button>
            </td>
            <td>
              <Button
                style={ButtonStyle.PRIMARY_SMALL}
                onClickHandler={() => {
                  router.push("/criar-conta");
                }}
              >
                Contratar
              </Button>
            </td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>Valor Mensal</td>
            <td>0 R$</td>
            <td className={classes.table_anual_cell}>19.90 R$</td>
            <td>40 R$</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>
              Notificações para clientes via Whatsapp
            </td>
            <td>Não</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>
              Notificações para clientes via SMS
            </td>
            <td>Não</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>
              Gestão de Cobranças via Notificações
            </td>
            <td>Não</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>
              Armazenamento na nuvem de fotos de clientes
            </td>
            <td>Não</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>Agenda Online</td>
            <td>Sim</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>Gestão de Clientes</td>
            <td>Sim</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>Gestão Financeira</td>
            <td>Sim</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>Portal Web</td>
            <td>Sim</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>App Android</td>
            <td>Sim</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td className={classes.table_skill_cell}>App iOS</td>
            <td>Sim</td>
            <td className={classes.table_anual_cell}>Sim</td>
            <td>Sim</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Planos;
