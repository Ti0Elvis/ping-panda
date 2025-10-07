import { Fragment, PropsWithChildren } from "react";
import { LandingHeader } from "./components/landing-header";

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <Fragment>
      <LandingHeader />
      {children}
    </Fragment>
  );
}
