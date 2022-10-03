/*
  This file is the main container of the portal page.
  This component contains the header, footer, and the content wrapper which contains the content of page.
*/ 
import React from 'react';
import Header from "../Header/Header";
import Topbar from "../Topbar/Topbar";
import Footer from "../Footer/Footer";
import ContentWrapper from "../ContentWrapper/ContentWrapper";
import { Outlet } from 'react-router-dom';

const Main = ({children, contentBgColor}) => {
    return (
    <>
      <Header />
      <Topbar className="bg-green mt-3" appName="DARFO2 PORTAL" fluid={false} />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </>
    )
}

export default Main;