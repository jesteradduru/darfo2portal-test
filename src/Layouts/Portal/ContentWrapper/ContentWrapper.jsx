/*
    This file is the container of Contents in portal Homepage
*/
import _ from 'lodash';
import React from 'react';
import './ContentWrapper.style.js';
import { StyledContentWrapper } from './ContentWrapper.style.js';
const ContentWrapper = ({children, bgColor}) => {
    return (
        <StyledContentWrapper className={`${!_.isUndefined(bgColor) ? bgColor : ''}`}>
            {children}
        </StyledContentWrapper>
    )
}

export default ContentWrapper;