/** @format */

import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout/layout";
import NotificationBottomProvider from "@/store/notification-context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <NotificationBottomProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationBottomProvider>
    </SessionProvider>
  );
}
