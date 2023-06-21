/** @format */

import Footer from "./footer";
import MainHeader from "./main-header";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const Layout = ({ children }: Props) => (
  <>
    <MainHeader />
    <main>{children}</main>
    <Footer />
  </>
);

export default Layout;
