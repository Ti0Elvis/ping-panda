import { Fragment, PropsWithChildren } from "react";
import { RootHeader } from "./components/root-header";

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <Fragment>
      <RootHeader />
      {children}
    </Fragment>
  );
}
