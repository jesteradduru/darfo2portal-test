/*
  This is a navigation bar component of reactstrap/bootstrap. It contains the page title and dropdown controls and links (e.g.Profile, Adminp Panel, Logout)
*/
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { getUser, logout } from "../../../features/Portal/userSlice";
import Cookies from "js-cookie";
import { StyledLink } from "../../../Assets/styles/style";
import { GiHamburgerMenu } from "react-icons/gi";
import IconatedButton from "../IconatedButton/IconatedButton";
import { StyledDiv } from "./Topbar.style";
import { useEffect } from "react";

const Topbar = ({ className, appName, navItem, sidenav, toggleSideNav }) => {
  const { emp_firstname, role_name } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser())
  }, [])
  return (
    <Navbar className={className} expand="md" dark>
      <StyledDiv>
        <IconatedButton
          onClick={toggleSideNav}
          icon={<GiHamburgerMenu />}
          className="bg-green border-0 me-2"
        />
      </StyledDiv>
      <NavbarBrand href="/dts">{appName}</NavbarBrand>
      {navItem && (
        <Nav navbar className="me-auto d-none d-sm-block">
          <NavItem>
            <NavLink href='/dts/managementOfCommunications/inbox' className="text-light-green" active>
              {navItem}
            </NavLink>
          </NavItem>
        </Nav>
      )}
      {Cookies.get("accessToken") ? ( //if user is logged in
        <>
          {/* <NavbarToggler
            onClick={() => {
              setToggle(!toggle);
            }}
          /> */}
          {/* <Collapse navbar isOpen={toggle}> */}
          <Nav className="ms-auto" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle caret nav>
                Welcome {emp_firstname}!
              </DropdownToggle>
              <DropdownMenu end={true}>
                {role_name?.includes('System') && (
                  <><DropdownItem>
                    <StyledLink target={"_blank"} to="/admin/accounts">
                      Admin Panel
                    </StyledLink>
                  </DropdownItem>
                  <DropdownItem divider /></>
                )}

                
                <DropdownItem onClick={() => dispatch(logout())}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* </Collapse> */}
        </>
      ) : (
        //if user is not logged in
        <></>
      )}
    </Navbar>
  );
};

export default Topbar;
