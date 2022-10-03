/*
  For controlling the view based on permissions
*/
import React from "react";
import { useSelector } from "react-redux";

const RequirePermission = ({ children, allowedPermissions, isPage }) => {
  const { userPermissions } = useSelector((state) => state.roles);


  const isUserPermitted = userPermissions.includes(allowedPermissions);
  if(isUserPermitted){
      return <>{children}</>;
  }else{
    return isPage ? <h1>Not allowed</h1> : <></>
  }
};

export default RequirePermission;
