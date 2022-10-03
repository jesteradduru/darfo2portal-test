/* 
  This component is the side navigation menu and can be imported in different page
  This component accepts a navigation configuration in json that contains navigation header name, route name, route.
*/
import React from "react";
import {
  StyledContainer,
  StyledNavItem,
  StyledNavItemHeader,
  StyledNav
} from "./Sidenav.style";
import SideNavLink from "../SideNavLink/SideNavLink";
import { Badge } from "reactstrap";
import { isEmpty } from "lodash";
const _ = require('lodash')

const Sidenav = (props) => {
  const {navConfig, isOpen = false} = props;

  const nav = navConfig.map((nav, index) => {
    const navIsEmpty = () => {
      const navLinksCount = nav.links.length;
      const navHiddenLinks = nav.links.filter(l => l.hidden).length;

      return navLinksCount === navHiddenLinks;
    }
    const subLinks = nav.links.map((link, index) => {
      if(link.hidden){
        return null;
      }
      return (
        <StyledNavItem key={index}>
          <SideNavLink to={link.linkUrl} >
            <span>{link.icon}</span>{link.linkName}
            {link.showBadge && 
              <>
                <Badge color="light" className="text-dark ms-1">{link.count}</Badge>
                {link.new !== 0 && <Badge color="danger" className="ms-1">+{link.new}</Badge>}
              </>
            }
          </SideNavLink>
        </StyledNavItem>
      );
    });

    return (
      <div key={index}> 
        <StyledNavItemHeader key={index} className={navIsEmpty() && 'd-none'}>
          <span>{nav.headerIcon}</span>
          <h6>{nav.headerName}</h6>
        </StyledNavItemHeader>
        {subLinks}
      </div>
    );

  });

  return (
    <div>
    <StyledContainer className={`bg-green ${isOpen && "open"}`} {...props}>
      <StyledNav vertical>{nav}</StyledNav>
    </StyledContainer>  
    </div>
  );
};

export default Sidenav;
