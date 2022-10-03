/*
  This is the Management of Communications Page under DTS.
*/
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";
import { Topbar, Sidenav } from "../../../Layouts/Portal";
import { useDispatch } from "react-redux";

import {
  BsFillPatchQuestionFill,
  BsFillEnvelopeFill,
  BsSearch,
  BsFillPieChartFill,
  BsCalendarCheckFill,
  BsPlusLg,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { getDrafts } from "../../../features/dts/drafts/draftsSlice";
import { checkPermission } from "../../../Helpers/portal_helpers";
import { getUserRolePermission } from "../../../features/Portal/rolesSlice";
import { Notification } from "../../../Layouts/DTS";
import { getInbox } from "../../../features/dts/inbox/inboxSlice";

const MOC = ({socket}) => {
  const dispatch = useDispatch();
  const draftsCount = useSelector((state) => state.drafts.drafts.length);
  const inboxCount = useSelector((state) => state.inbox.inbox.length);
  const { user_id } = useSelector((state) => state.user.user);
  const { userPermissions } = useSelector((state) => state.roles);
  const {newInboxCount} = useSelector((state) => state.inbox);

  useEffect(() => {
    dispatch(getDrafts(user_id)); 
    dispatch(getUserRolePermission());
    dispatch(getInbox());
  }, [dispatch, user_id]);

  const navConfig = [
    {
      headerName: "Incoming Communications",
      headerIcon: <BsFillEnvelopeFill />,
      links: [
        {
          linkName: "Add New",
          linkUrl: "/dts/managementOfCommunications/add",
          icon: <BsPlusLg />,
          active: true,
          hidden: !checkPermission(userPermissions, "addCommunication"),
        },
        {
          linkName: "Inbox",
          linkUrl: "/dts/managementOfCommunications/inbox",
          active: false,
          count: inboxCount,
          new: newInboxCount,
          showBadge: true,
        },
        {
          linkName: "Drafts",
          linkUrl: "/dts/managementOfCommunications/draft",
          active: false,
          count: draftsCount,
          new: 0,
          showBadge: true,
          hidden: !checkPermission(userPermissions, "manageDrafts"),
        },
        {
          linkName: "Classifications",
          linkUrl: "/dts/managementOfCommunications/classifications",
          active: false,
          hidden: !checkPermission(userPermissions, "manageClassifications"),
        },
      ],
    },
    {
      headerName: "Search",
      headerIcon: <BsSearch />,
      links: [
        {
          linkName: "Basic Search",
          linkUrl: "/dts/managementOfCommunications/search/basic",
          active: true,
          hidden: !checkPermission(userPermissions, "basicSearch"),
        },
        {
          linkName: "Advanced Search",
          linkUrl: "/dts/managementOfCommunications/search/advanced",
          active: false,
          hidden: !checkPermission(userPermissions, "advancedSearch"),
        },
      ],
    },
    {
      headerName: "Dashboard",
      headerIcon: <BsFillPieChartFill />,
      links: [
        {
          linkName: "Analytics",
          linkUrl: "/dts/managementOfCommunications/analytics",
          active: true,
          hidden: !checkPermission(userPermissions, "viewDashboardAnalytics"),
        },
        {
          linkName: "Reports",
          linkUrl: "/dts/managementOfCommunications/reports",
          hidden: !checkPermission(userPermissions, "exportReport"),
          active: false,
        },
        {
          linkName: "Communication Logs",
          linkUrl: "/dts/managementOfCommunications/communicationLogs",
          hidden: !checkPermission(userPermissions, "exportLog"),
          active: false,
        },
      ],
    },
    {
      headerName: "Calendar",
      headerIcon: <BsCalendarCheckFill />,
      links: [
        {
          linkName: "RED's Activities",
          linkUrl: "/dts/managementOfCommunications/calendar",
          active: true,
          hidden: !checkPermission(userPermissions, "viewCalendar"),
        },
      ],
    },
    {
      headerName: "Help & Support",
      headerIcon: <BsFillPatchQuestionFill />,
      links: [
        {
          linkName: "Help Center",
          linkUrl: "/dts/managementOfCommunications/helpCenter",
        },
        // {
        //   linkName: "Report a Problem",
        //   linkUrl: "/dts/managementOfCommunications/reportAProblem",
        // },
      ],
    },
  ];

  const [isSideNavOpen, setSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!isSideNavOpen);
  };

  return (
    <>
      <Notification socket={socket} />
      <Topbar
        className="bg-dark-green"
        appName="DTS"
        navItem="Management of Communication"
        sidenav={toggleSideNav}
        toggleSideNav={toggleSideNav}
      />
      <div className="d-flex">
        <Sidenav
          navConfig={navConfig}
          isOpen={isSideNavOpen}
          toggleSideNav={toggleSideNav}
        />
        <Container onClick={() => setSideNavOpen(false)}  fluid>
          <Outlet />
        </Container>
      </div>
    </>
  );
};

export default MOC;
