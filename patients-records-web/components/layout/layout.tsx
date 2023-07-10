/** @format */

import { useRouter } from "next/router";
import Footer from "./footer";

import { useSession } from "next-auth/react";
import AuthMainHeader from "./auth-main-header";
import NoAuthMainHeader from "./no-auth-main-header";

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
  }

  return (
    <>
      {status === "authenticated" && userInfo?.userCreationCompleted ? (
        <AuthMainHeader />
      ) : (
        <NoAuthMainHeader />
      )}

      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
