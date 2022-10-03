import React from "react";
import { Container } from "reactstrap";
import dtsmanual from '../../../Assets/DSD.pdf'
const HelpCenter = () => {
  return (
    <Container>
        <h3 className="mt-3">DTS Manual</h3>
        <embed src={dtsmanual} className='w-100' style={{height: '80vh'}} type="application/pdf" />
    </Container>
  );
};

export default HelpCenter;
