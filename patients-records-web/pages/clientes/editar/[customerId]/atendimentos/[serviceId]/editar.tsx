/** @format */

import EditService from "@/components/customers/services/edit-service";
import Head from "next/head";

const EditarAtendimento = () => {
  return (
    <>
      <Head>
        <title>Editar Atendimento</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EditService />
    </>
  );
};

export default EditarAtendimento;
