/** @format */

import CreateAnamnesis from "@/components/customers/anmnesis/create-anamnesis";
import Head from "next/head";

const CriarAnamnese = () => {
  return (
    <>
      <Head>
        <title>Nova Anamnese</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateAnamnesis />
    </>
  );
};

export default CriarAnamnese;
