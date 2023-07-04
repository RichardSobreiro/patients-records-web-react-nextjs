/** @format */

import { useRouter } from "next/router";
import Footer from "./footer";
import MainHeader from "./main-header";

import { useSession } from "next-auth/react";
import LoadingSpinner from "../ui/loading-spinner";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const Layout = ({ children }: Props) => {
  const route = useRouter();
  const { data: session, status, update } = useSession();

  const userInfo: any = session?.user;

  if (
    status === "authenticated" &&
    !route.pathname.includes("informacoes-adicionais") &&
    !userInfo.userCreationCompleted
  ) {
    update().then((newSession: any) => {
      if (!newSession?.user?.userCreationCompleted)
        route.replace("/informacoes-adicionais");
    });
  } else if (status === "loading") {
  }

  return (
    <>
      <MainHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
