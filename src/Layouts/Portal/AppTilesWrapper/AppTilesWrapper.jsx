/*
  This file is the container of the AppTile component.
  It accepts children as its properties.
*/
import React from 'react'
import { Container, Row } from 'reactstrap'
const AppTilesWrapper = ({children}) => {
    return (
        <Container className="pt-4">
        <Row>
          {children}
        </Row>
      </Container>
    )
}

export default AppTilesWrapper;