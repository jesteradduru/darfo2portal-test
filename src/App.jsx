/*
  This component is the main component of the portal. 
  It controls the view of different routes.
  It contains different routes the user can access within the portal.
*/
import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Layouts/Portal/ProtectedRoute/ProtectedRoute";
import { ErrorBoundary, Main, RequirePermission } from "./Layouts/Portal";
import { Container } from "reactstrap";
import {
  Homepage,
  PageUnavailable,
  AdminPanel,
  Accounts,
  Roles,
  Login,
  DTS,
  LoadingApp,
} from "./Pages/Portal/";
import {
  AddCommunication,
  Classfications,
  Drafts,
  MOC,
  Inbox,
  ViewCommunication,
  ViewTask,
  Search,
  Reports,
  CommunicationLogs,
  Analytics,
  HelpCenter,
} from "./Pages/DTS/";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Calendar from "./Pages/DTS/Calendar/Calendar";

const App = () => {
  const { user } = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);
  const apiServer = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setSocket(io(apiServer));
  }, []);

  useEffect(() => {
    socket?.emit("addNewUser", user);
  }, [socket, user]);

  return (
    <Container fluid className="m-0 p-0">
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<LoadingApp />}>
            <Routes>
              <Route path="/" element={<Main />}>
                <Route path="/login" element={<Login />} />
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Homepage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dts"
                  element={
                    <ProtectedRoute>
                      <DTS />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<PageUnavailable />} />
              </Route>
              <Route
                path="/dts/managementOfCommunications"
                element={
                  <ProtectedRoute>
                    <MOC socket={socket} />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="/dts/managementOfCommunications/add"
                  element={
                    <RequirePermission
                      isPage
                      allowedPermissions={"addCommunication"}
                    >
                      <ErrorBoundary>
                        <AddCommunication socket={socket} />
                      </ErrorBoundary>
                    </RequirePermission>
                  }
                />
                <Route
                  path="/dts/managementOfCommunications/classifications"
                  element={
                    <RequirePermission
                      isPage
                      allowedPermissions={"manageClassifications"}
                    >
                      <Classfications />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/dts/managementOfCommunications/inbox"
                  element={<Inbox />}
                />
                <Route
                  path="/dts/managementOfCommunications/inbox/viewCommunication/:inbox_id/:com_id"
                  element={<ViewCommunication />}
                />
                <Route
                  path="/dts/managementOfCommunications/inbox/viewTask/:inbox_id/:com_id"
                  element={<ViewTask />}
                />
                <Route
                  path="/dts/managementOfCommunications/search/:search_type"
                  element={<Search />}
                />
                <Route
                  path="/dts/managementOfCommunications/analytics"
                  element={<Analytics />}
                />
                <Route
                  path="/dts/managementOfCommunications/reports/"
                  element={
                    <RequirePermission
                      allowedPermissions={"exportReport"}
                      isPage
                    >
                      <Reports />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/dts/managementOfCommunications/reports/:com_ids"
                  element={
                    <RequirePermission
                      allowedPermissions={"exportReport"}
                      isPage
                    >
                      <Reports />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/dts/managementOfCommunications/communicationLogs"
                  element={<CommunicationLogs />}
                />
                <Route
                  path="/dts/managementOfCommunications/calendar"
                  element={<Calendar />}
                />
                <Route
                  path="/dts/managementOfCommunications/draft/"
                  element={<Drafts socket={socket} />}
                />
                <Route
                  path="/dts/managementOfCommunications/HelpCenter/"
                  element={<HelpCenter />}
                />
                <Route
                  path="/dts/managementOfCommunications/*"
                  element={<PageUnavailable />}
                />
              </Route>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  path="/admin/accounts"
                  element={
                    <RequirePermission
                      isPage
                      allowedPermissions={"manageAccounts"}
                    >
                      <Accounts />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/admin/roles"
                  element={
                    <RequirePermission
                      isPage
                      allowedPermissions={"manageRoles"}
                    >
                      <Roles />
                    </RequirePermission>
                  }
                />
                <Route path="/admin/*" element={<PageUnavailable />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </Container>
  );
};

export default App;
