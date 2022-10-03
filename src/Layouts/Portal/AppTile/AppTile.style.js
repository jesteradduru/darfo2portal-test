import styled from 'styled-components';
import {Card, CardBody} from 'reactstrap';
import { Link } from 'react-router-dom';

export const StyledCard = styled(Card)`
    width:170px;
    height:150px;
    text-decoration: none;

    @media only screen and (max-width: 1200px) {
        width:130px;
        height:130px;
        h6 {
            font-size: 12px;
        }
    }
    @media only screen and (max-width: 300px) {
        width:100px;
        height:100px;
        h6 {
            font-size: 8px;
        }
    }
`

export const StyledCardBody = styled(CardBody)`
    display:flex;
    align-items:center;
    flex-direction: column;
    text-align: center;
`

export const StyledLink = styled(Link)`
    text-decoration: none;
`