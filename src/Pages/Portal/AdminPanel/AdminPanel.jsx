/*
  This is the Admin Panel Page. 
*/
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {  Container } from "reactstrap";
import {  Topbar, Sidenav } from "../../../Layouts/Portal";
import { BsPersonCircle, BsFillPatchQuestionFill } from "react-icons/bs";
import { checkPermission } from "../../../Helpers/portal_helpers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserRolePermission } from "../../../features/Portal/rolesSlice";

export const AdminPanel = () => {
  const { userPermissions } = useSelector((state) => state.roles);
  const dispatch = useDispatch()
  const navConfig = [
    {
      headerName: "Users",
      headerIcon: <BsPersonCircle />,
      links: [
        { linkName: "Accounts", linkUrl: "/admin/accounts", active: true , hidden: !checkPermission(userPermissions, "manageAccounts"), },
        { linkName: "Roles", linkUrl: "/admin/roles", active: false, hidden: !checkPermission(userPermissions, "manageRoles") },
      ],
    },
    {
      headerName: "Help & Support",
      headerIcon: <BsFillPatchQuestionFill />,
      links: [
        // { linkName: "Requests", linkUrl: "/admin/requests" }
      ],
    },
  ];
 
  const [isSideNavOpen, setSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!isSideNavOpen);
  };

  useEffect(() => {
    dispatch(getUserRolePermission())
  }, [dispatch])
  return (
    <Container fluid style={{overflow: "hidden"}}>
      <Topbar
        className="bg-dark-green"
        appName="DA-RFO2 PORTAL"
        navItem="Admin Panel"
        sidenav={toggleSideNav}
        toggleSideNav={toggleSideNav}
      />
      <div className="d-flex">
        <Sidenav navConfig={navConfig} isOpen={isSideNavOpen} toggleSideNav={toggleSideNav}/>
        <Container onClick={() => setSideNavOpen(false)}>
          <Outlet />
        </Container>
      </div>
    </Container>
  );
};

export default AdminPanel;
