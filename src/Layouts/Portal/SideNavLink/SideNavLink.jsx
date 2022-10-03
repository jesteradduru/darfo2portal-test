/*
  This is a child component of Side Navigation component.
*/
import React from "react";
import { Link, useLocation } from "react-router-dom";


const SideNavLink = (props) => {
const currentLocation = useLocation();
var isActive = currentLocation.pathname === props.to;
var className = isActive ? "active" : "";
  return (
    <Link className={`${className} nav-link`} {...props}>
      {props.children}
    </Link>
  );
};


export default SideNavLink;
