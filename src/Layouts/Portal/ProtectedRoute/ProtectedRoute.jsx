/*
  This component is controlling the page view for unauthorize access from unauthenticated users.
*/
import React, { useEffect } from "react";
import { Navigate,  useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { getUser } from "../../../features/Portal/userSlice";

const ProtectedRoute = ({ children} ) => {
  const location = useLocation();
  const accessToken = Cookies.get("accessToken")
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch])

  if (accessToken) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
