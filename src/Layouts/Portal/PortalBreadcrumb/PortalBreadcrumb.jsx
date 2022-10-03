/*
    This component is a navigation scheme that
    reveals the user's location in the portal page.
*/
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {BreadcrumbItem } from 'reactstrap'
import { StyledBreadcrumb } from './PortalBreadcrumb.style'

const PortalBreadcrumb = () => {
    const location = useLocation()
    return (
        <StyledBreadcrumb className="mb-4">
            <BreadcrumbItem>
                <Link to="/">
                    Home
                </Link>
            </BreadcrumbItem>
            {location.pathname === "/dts" &&
                <BreadcrumbItem>
                <Link to="/dts">
                    Document Tracking System
                </Link>
            </BreadcrumbItem>
            }
        </StyledBreadcrumb>
    )
}

export default PortalBreadcrumb;