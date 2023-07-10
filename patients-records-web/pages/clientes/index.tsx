/** @format */

import Filter from "@/components/customers/filter";
import CustomersList from "@/components/customers/list";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Customer } from "@/models/customers/Customer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const Clientes = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [customersList, setCustomersList] = useState<Customer | undefined>();

  return (
    <>
      <Filter />
      {isLoading ? <LoadingSpinner /> : <CustomersList />}
    </>
  );
};

export default Clientes;
