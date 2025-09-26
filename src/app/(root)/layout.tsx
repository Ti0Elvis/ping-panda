import { Header } from "./components/header";
import { Fragment, PropsWithChildren } from "react";

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
}
