import { Nav, NavItem } from "reactstrap";
import styled from "styled-components";

export const StyledContainer = styled.div`
  min-height: 100vh;
  height: 100%;
  padding: 0;
  z-index: 99;
  width: 250px;
  transition: width  .1s ease-out;
  overflow-y: auto;

  @media only screen and (max-width: 1200px) {
    width: 220px;
  }

  @media only screen and (max-width: 1000px) {
    width: 0px;
  }

  &.open {
    width: 250px;
  }

`;

export const StyledNavItemHeader = styled(NavItem)`
  display: flex;
  color: #fff;
  align-items: center;
  height: 3rem;
  padding: 0 15px 0 15px;
  span {
    margin-right: 0.5rem;
    padding: 0;
  }
  h6 {
    margin: 0;
  }
`;

export const StyledNavItem = styled(NavItem)`
  .active {
    background-color: #40916c;
    color: #fff;
  }

  & span{
    margin-right: 7px;
  }

  a {
    padding-left: 28px;
    color: #fff;
    cursor: pointer;
    &:hover {
      background-color: #1b4332;
      color: #fff;
    }
  }
`;

export const StyledNav = styled(Nav)`
  div {
    border-bottom: 1px solid white;
  }
`;
