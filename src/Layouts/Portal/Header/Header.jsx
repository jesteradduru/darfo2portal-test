/*
  This component is the header section of the portal page.
  It consist of DA logo, Oneda slogan, Republic of the philippines logo
*/
import React from "react";
import oneda from "../../../Assets/images/OneDA-Slogan.png";
import dalogo from "../../../Assets/images/da_logo.png";
import ph_logo from "../../../Assets/images/philippines_logo.png";
import { Row, Col, Container } from "reactstrap";

const Header = () => {
  return (
    <Container fluid>
      <Row>
        <Col md="1" sm="2" xs="3">
          <img src={dalogo} alt="DA-Logo" className="img-fluid" />
        </Col>
        <Col md="1" className="d-none d-md-block">
          <img src={ph_logo} alt="ph-Logo" className="img-fluid" />
        </Col>
        <Col md="5" sm="10" xs="9" className="d-flex flex-column justify-content-center">
          <h2>DEPARTMENT OF AGRICULTURE</h2>
        </Col>
        <Col md="5" className="d-none d-md-block">
          <img src={oneda} alt="ph-Logo" className="img-fluid" />
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
