/** @format */

import CreateService from "@/components/customers/services/create-service";
import Head from "next/head";

const CriarAtendimento = () => {
  return (
    <>
      <Head>
        <title>Novo Atendimento</title>
        <meta
          name="description"
          content="Portal para gerenciamento de empreendimentos na área de beleza."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateService />
    </>
  );
};

export default CriarAtendimento;
