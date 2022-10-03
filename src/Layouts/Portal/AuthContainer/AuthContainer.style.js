import styled from "styled-components";
import { Card } from "reactstrap";
const StyledCard = styled(Card)`
  width: 60%;
  @media only screen and (max-width: 1000px) {
    width: 90%;
  }
`;

export {StyledCard};