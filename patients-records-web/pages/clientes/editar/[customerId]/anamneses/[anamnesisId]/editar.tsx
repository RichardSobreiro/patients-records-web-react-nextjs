/** @format */

import EditAnamnesis from "@/components/customers/anmnesis/edit-anamnesis";
import Head from "next/head";

const EditarAnamnesis = () => {
  return (
    <>
      <Head>
        <title>Editando Anamnese</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EditAnamnesis />
    </>
  );
};

export default EditarAnamnesis;
