/*
  This is the Document Tracking System Page. Users is redirected to this route when they click the DTS AppTile component.
*/
import React from "react";
import {AppTile, AppTilesWrapper, PortalBreadcrumb} from "../../../Layouts/Portal/";
import { BsBookHalf } from "react-icons/bs";
const DTS = () => {
  return (
      <AppTilesWrapper>
        <PortalBreadcrumb />
        <AppTile appName={"Management of Communications"} icon={<BsBookHalf />} target="_blank" to="/dts/managementOfCommunications/inbox" />
      </AppTilesWrapper>
  );
};

export default DTS;
