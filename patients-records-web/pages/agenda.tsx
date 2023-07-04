/** @format */

import { useSession } from "next-auth/react";

const Agenda = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <h1>{session.user?.name}</h1>;
  } else {
    return <h1>Não autorizado</h1>;
  }
};

export default Agenda;
