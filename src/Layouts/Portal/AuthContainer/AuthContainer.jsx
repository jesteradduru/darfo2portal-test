/*
  This component is the container of the Authentication/Login Form.
*/
import React from "react";
import {CardBody, Col, Row } from "reactstrap";
import { StyledCard } from "./AuthContainer.style";

const AuthContainer = ({ title, children }) => {
  return (
    <StyledCard className="center-element">
      <CardBody style={{ padding: 0 }}>
        <Row>
          <Col md="7">{children}</Col>
          <Col
            md="5"
            className="bg-light-green m-0 element-wrapper d-none d-md-block"
          >
            <h2 className="text-light center-element">{title}</h2>
          </Col>
        </Row>
      </CardBody>
    </StyledCard>
  );
};

export default AuthContainer;
