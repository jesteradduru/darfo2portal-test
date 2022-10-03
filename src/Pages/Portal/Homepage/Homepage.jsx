/*
  This is the main or landing page. Users is redirected to this route after the user is succesfully authenticated.
*/
import React from "react";
import { BsBookHalf, BsPersonLinesFill } from "react-icons/bs";
import {AppTile, AppTilesWrapper, PortalBreadcrumb} from "../../../Layouts/Portal";

const Homepage = () => {
  return (
      <AppTilesWrapper>
        <PortalBreadcrumb />
        <AppTile appName={"Document Tracking System"} to="/dts" icon={<BsBookHalf />} />
        <AppTile appName={"Human Resource Information System"} to="/dts" disabled   icon={<BsPersonLinesFill />} />
      </AppTilesWrapper>
  );
};

export default Homepage;
