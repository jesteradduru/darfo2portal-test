/*
  This is a child component of AppTilesWrapper. It is the tile view of apps in portal homepage.
  It accepts application name and the route of the app.
*/
import React from "react";
import {Col } from "reactstrap";
import { StyledCard , StyledCardBody, StyledLink} from "./AppTile.style";
import { BsBookHalf } from "react-icons/bs";

const AppTile = ({ appName, to, target ="_self", disabled, icon }) => {
  return (
    <Col lg='2' md="3" sm="4" xs='6' className="p-2 d-flex justify-content-center">
        <StyledLink to={to} target={target} className={`${ disabled ? 'text-light' : 'text-green'}`}  style={{pointerEvents: disabled ? 'none' : '' }}>
        <StyledCard className={`${ disabled ? 'bg-light-gray' : 'bg-super-light-green'}`}>
          <StyledCardBody>
              <h1>{icon}</h1>
              <h6>{appName}</h6>
          </StyledCardBody>
        </StyledCard>
      </StyledLink>
    </Col>
  );
};

export default AppTile;
