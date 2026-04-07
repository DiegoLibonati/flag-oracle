import { Fragment } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";

import type { JSX } from "react";

import Navbar from "@/components/Navbar/Navbar";

export const PublicRoute = (): JSX.Element => {
  return (
    <Fragment>
      <Navbar></Navbar>
      <Outlet />
    </Fragment>
  );
};
