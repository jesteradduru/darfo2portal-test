/*
  Button with icon component
*/
import React from 'react'
import { Button } from 'reactstrap'
const IconatedButton = (props) => {
    const {icon, name, size = "sm"} = props;
  return (
    <Button color="primary" size={size} className='d-flex align-items-center' {...props} >
        {icon}&nbsp;
        {name}
    </Button>
  )
}

export default IconatedButton