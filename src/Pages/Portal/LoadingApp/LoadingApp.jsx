import React from "react";
import { Container, Spinner } from "reactstrap";
const LoadingApp = () => {
  return (
    <Container className="center-element d-flex flex-column align-items-center">
      <Spinner />
      <br />
      <h5>Loading App, Please Wait</h5>
    </Container>
  );
};

export default LoadingApp;
